"""Prediction service for the trained PayLater credit risk model."""

from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from app.schemas.assessment import FinancialProfile, PurchaseRequest


ARTIFACT_DIR = Path(__file__).resolve().parent / "artifacts"


class MLRiskModel:
    """Load the trained XGBoost model and its fitted preprocessing artifacts."""

    def __init__(self) -> None:
        required_artifacts = (
            "paylater_best_model.pkl",
            "paylater_imputer.pkl",
            "paylater_features.pkl",
        )
        missing = [name for name in required_artifacts if not (ARTIFACT_DIR / name).is_file()]
        if missing:
            raise FileNotFoundError(
                f"Missing trained risk model artifact(s) in {ARTIFACT_DIR}: {', '.join(missing)}"
            )

        self.model = joblib.load(ARTIFACT_DIR / "paylater_best_model.pkl")
        self.imputer = joblib.load(ARTIFACT_DIR / "paylater_imputer.pkl")
        self.imputer_statistics = np.asarray(self.imputer.statistics_, dtype=float)
        self.features = joblib.load(ARTIFACT_DIR / "paylater_features.pkl")

        if not hasattr(self.model, "predict_proba"):
            raise TypeError("The trained risk model must support predict_proba().")

    @staticmethod
    def _build_features(profile: FinancialProfile, purchase: PurchaseRequest) -> dict[str, float]:
        """Translate the assessment profile into the trained credit bureau schema."""
        income = max(float(profile.monthly_income), 1.0)
        age = float(profile.age_years)
        active_lines = max(int(profile.active_loans), 0)
        debt_ratio = float(profile.existing_emi) / income
        # Existing clients may only send a total missed-payment count. Preserve
        # compatibility by treating it as 30–59 day delinquency when granular
        # bureau history has not been supplied.
        granular_history = any(
            value is not None
            for value in (profile.late_30_59, profile.late_60_89, profile.late_90_plus)
        )
        delinquency_30_59 = float(profile.late_30_59 or 0) if granular_history else float(profile.defaults)
        delinquency_60_89 = float(profile.late_60_89 or 0)
        delinquency_90 = float(profile.late_90_plus or 0)
        total_delinquency = delinquency_30_59 + delinquency_60_89 + delinquency_90
        utilization = float(np.clip(profile.revolving_utilization, 0.0, 2.0))

        return {
            "RevolvingUtilizationOfUnsecuredLines": utilization,
            "age": age,
            "DebtRatio": debt_ratio,
            "MonthlyIncome": income,
            "NumberOfOpenCreditLinesAndLoans": float(active_lines),
            "NumberOfTimes90DaysLate": delinquency_90,
            "NumberRealEstateLoansOrLines": float(profile.real_estate_loans),
            "NumberOfTime30-59DaysPastDueNotWorse": delinquency_30_59,
            "NumberOfTime60-89DaysPastDueNotWorse": delinquency_60_89,
            "NumberOfDependents": float(profile.dependents),
            "income_per_dependent": income / (profile.dependents + 1),
            "total_delinquency": total_delinquency,
            "severe_delinquency": delinquency_90 + delinquency_60_89,
            "recent_delinquency": delinquency_30_59 + delinquency_60_89,
            "credit_utilization_risk": utilization,
            "credit_lines_per_age": active_lines / max(age, 18.0),
            "real_estate_loan_ratio": profile.real_estate_loans / (active_lines + 1.0),
            "debt_burden": debt_ratio * income,
            "financial_stress_score": min(debt_ratio, 5.0) + utilization + total_delinquency,
            "age_income_interaction": age * float(np.log1p(income)),
        }

    def predict_ml_risk_score(self, profile: FinancialProfile, purchase: PurchaseRequest) -> float:
        row = self._build_features(profile, purchase)
        features = pd.DataFrame([[row[name] for name in self.features]], columns=self.features)
        # Apply the fitted medians directly. This is SimpleImputer(strategy="median")
        # behavior and avoids relying on a private sklearn attribute that changed
        # across releases. The estimator itself still receives the fitted feature order.
        values = features.to_numpy(dtype=float, copy=True)
        missing = np.isnan(values)
        values[missing] = np.broadcast_to(self.imputer_statistics, values.shape)[missing]
        transformed = pd.DataFrame(values, columns=self.features)

        probabilities = self.model.predict_proba(transformed)[0]
        classes = list(self.model.classes_)
        try:
            high_risk_index = classes.index(1)
        except ValueError:
            high_risk_index = int(np.argmax(classes))
        return round(float(probabilities[high_risk_index]) * 100.0, 1)


ml_risk_service = MLRiskModel()
