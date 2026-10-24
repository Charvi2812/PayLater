# PayLater: Responsible BNPL and Financial Wellness

PayLater is a financial wellness prototype that helps a user explore whether a Buy Now, Pay Later (BNPL) purchase fits their monthly budget. It combines a rule-based BNPL risk score, affordability and debt-to-income (DTI) calculations, repayment stress analysis, and a trained credit-default model estimate.

The application is decision support for education and experimentation. It is not a lender, a credit bureau, or a formal credit decision service.

**Live demo:** [pay-later-self.vercel.app](https://pay-later-self.vercel.app/)

## Features

- BNPL risk assessment with a transparent rule-based score and risk tier.
- Monthly affordability, DTI before and after a purchase, and remaining cash estimates.
- EMI options for 3, 6, 9, and 12 months, with a credit-card cost comparison.
- Financial stress score and a recommendation based on risk, DTI, and affordability.
- A separate estimate from the trained credit-default classification model.
- What-if purchase simulator, financial education content, and a financial assistant.
- Demo profiles and optional assessment history through Supabase.

## How the risk assessment works

The main BNPL `risk_score` comes from the project's rule-based `RiskEngine`. The recommendation combines that score with financial stress, post-purchase DTI, and remaining monthly cash. This keeps the purchase affordability decision tied to the BNPL-specific calculations.

The machine learning model is an additional signal. It is a trained XGBoost classifier from `PL/Untitled.ipynb`, saved with its fitted preprocessing artifacts. It predicts the dataset's serious-delinquency label and returns a 0-100 probability as `ml_risk_score`. The model's training data does not include a proposed purchase or BNPL outcome, so the model estimate is displayed separately and does not replace the BNPL affordability rules.

The model expects 20 credit-bureau features. The assessment form collects age, dependents, credit utilization, late-payment counts by period, and real-estate loan count, along with income, existing EMI, and active loan count. Other API clients may omit these newer fields; the backend then uses schema defaults. Older clients that only send a total `defaults` count have that count mapped to the 30-59-day-late feature.

The training dataset and notebook are in `PL/`. The backend loads the serving artifacts from `backend/app/ml/artifacts/`:

- `paylater_best_model.pkl` - trained classifier.
- `paylater_imputer.pkl` - fitted median imputation values.
- `paylater_features.pkl` - ordered model feature names.

Keep these files together and preserve the feature order when replacing the model. The saved model uses XGBoost and scikit-learn, which are included in the backend requirements.

## Technology

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts, Lucide React, Framer Motion.
- **Backend:** Python 3.11, FastAPI, Pydantic, scikit-learn, XGBoost, pandas, NumPy, Uvicorn.
- **Optional services:** Supabase for authentication/history and Gemini for assistant responses. The frontend and backend provide fallbacks when these services are not configured or available.

## Run locally

### Prerequisites

- Python 3.11 (the deployment runtime is specified in `backend/runtime.txt`).
- Node.js and npm.

### 1. Start the backend

From the project root, create and activate a virtual environment, then install the backend dependencies:

```powershell
cd backend
py -3.11 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Start the API:

```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The API is at [http://localhost:8000](http://localhost:8000) and interactive documentation is at [http://localhost:8000/docs](http://localhost:8000/docs).

### 2. Start the frontend

In a second terminal, from the project root:

```powershell
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Open [http://localhost:5173](http://localhost:5173). The frontend uses `http://localhost:8000/api` by default. To change that, set `VITE_API_BASE_URL` in `frontend/.env.local`, for example:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api
```

## Optional configuration

Copy `.env.example` to `backend/.env` to configure the backend. `GEMINI_API_KEY` enables Gemini-backed assistant responses; without it, the built-in educational response is used.

For Supabase authentication and assessment history, put the following values in `frontend/.env.local`:

```dotenv
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
VITE_ENABLE_ASSESSMENT_HISTORY=false
```

Supabase configuration is optional for exploring the assessment flow. Never commit private service-role keys or API secrets.

## API endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/assessment` | Assess a profile and proposed purchase. |
| `POST` | `/api/simulate` | Run an assessment from what-if inputs. |
| `POST` | `/api/assistant` | Ask a financial wellness question. |
| `GET` | `/api/financial-education` | Retrieve financial education cards. |
| `GET` | `/api/demo-profiles` | Retrieve sample assessment profiles. |

The assessment response includes `risk_score` and `risk_level` for the rule-based BNPL assessment, plus `ml_risk_score` for the trained model's credit-default estimate.

## Project layout

```text
backend/
  app/api/                 Assessment and assistant endpoints
  app/ml/                  Model loader and serving artifacts
  app/services/            Risk, affordability, EMI, stress, and recommendation logic
  app/schemas/             API request and response schemas
  requirements.txt
  runtime.txt
frontend/
  src/components/          Assessment form and result views
  src/services/            API, Supabase, and frontend fallback services
PL/
  Untitled.ipynb           Model training and evaluation notebook
  cs-training.csv          Training dataset
  paylater_*.pkl           Training output artifacts
```

## Limitations

The model estimates the outcome represented in its training data; it is not trained on BNPL repayment outcomes. Several app fields are translated into the dataset's credit-bureau feature schema, and defaults are used when older clients omit the newer fields. Its estimate should be treated as an educational signal alongside the separate BNPL affordability calculations, not as an approval guarantee or financial advice.
