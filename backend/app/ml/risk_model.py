import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from app.schemas.assessment import FinancialProfile, PurchaseRequest

class MLRiskModel:
    """
    Demonstrates machine learning integration alongside rule-based baseline.
    Generates synthetic training dataset and fits a Scikit-Learn RandomForest classifier
    to predict credit default/high-risk probability.
    """
    
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=50, random_state=42)
        self._train_baseline_model()
        
    def _generate_synthetic_data(self, n_samples: int = 500) -> pd.DataFrame:
        np.random.seed(42)
        income = np.random.uniform(20000, 150000, n_samples)
        existing_emi = income * np.random.uniform(0.0, 0.6, n_samples)
        credit_score = np.random.uniform(550, 850, n_samples)
        defaults = np.random.choice([0, 1, 2, 3], n_samples, p=[0.7, 0.2, 0.07, 0.03])
        purchase_price = np.random.uniform(5000, 80000, n_samples)
        tenure = np.random.choice([3, 6, 9, 12], n_samples)
        
        # Calculate synthetic label (1 = High Risk / Default, 0 = Safe)
        dti = (existing_emi / income) * 100
        risk_score = (900 - credit_score) * 0.15 + defaults * 25 + dti * 0.4
        label = (risk_score > 65).astype(int)
        
        df = pd.DataFrame({
            "monthly_income": income,
            "existing_emi": existing_emi,
            "credit_score": credit_score,
            "defaults": defaults,
            "purchase_price": purchase_price,
            "tenure": tenure,
            "dti": dti,
            "label": label
        })
        return df

    def _train_baseline_model(self):
        df = self._generate_synthetic_data(600)
        X = df[["monthly_income", "existing_emi", "credit_score", "defaults", "purchase_price", "tenure", "dti"]]
        y = df["label"]
        self.model.fit(X, y)
        
    def predict_ml_risk_score(self, profile: FinancialProfile, purchase: PurchaseRequest) -> float:
        try:
            dti = (profile.existing_emi / max(profile.monthly_income, 1.0)) * 100
            features = pd.DataFrame([{
                "monthly_income": profile.monthly_income,
                "existing_emi": profile.existing_emi,
                "credit_score": float(profile.credit_score),
                "defaults": profile.defaults,
                "purchase_price": purchase.product_price,
                "tenure": purchase.tenure,
                "dti": dti
            }])
            # Probabilities of class 1 (High risk)
            prob_high_risk = self.model.predict_proba(features)[0][1]
            return round(prob_high_risk * 100.0, 1)
        except Exception:
            return 35.0

ml_risk_service = MLRiskModel()
