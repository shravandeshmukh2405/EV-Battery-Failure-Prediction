# EV Battery Failure Prediction

An end-to-end machine learning project that predicts whether an electric vehicle battery is likely to fail based on vehicle, battery health, thermal, electrical, maintenance, and driving-related parameters.

The project uses **XGBoost** for classification and provides a web-based prediction interface using **FastAPI, HTML, CSS, and JavaScript**.

---

## 🚗 Project Overview

Electric vehicle batteries can degrade due to factors such as:

- Battery aging
- High operating temperature
- Increased charging cycles
- Capacity degradation
- Internal resistance
- Voltage imbalance
- Driving stress
- Previous battery faults
- Thermal conditions

This project analyzes these parameters and predicts:

- **Battery is Healthy**
- **Battery Failure Risk Detected**

The application also provides an estimated probability of battery failure.

---

## 🎯 Objectives

- Analyze EV battery and vehicle-related data
- Identify important factors associated with battery failure
- Engineer meaningful battery health and stress features
- Compare multiple machine learning classification models
- Select the best-performing model
- Deploy the trained model using FastAPI
- Provide an interactive web interface for predictions

---

## 📊 Dataset

The dataset contains approximately:

- **20,000 vehicle records**
- **70 features/columns**
- Target variable: `battery_failure`

Target values:

```text
0 → Battery is Healthy
1 → Battery Failure
```

The dataset includes information related to:

- Vehicle usage
- Battery health
- Battery capacity
- Temperature
- Electrical parameters
- Maintenance
- Driving behavior
- Battery stress

---

## 🧠 Machine Learning Workflow

```text
Dataset
   ↓
Data Cleaning
   ↓
Missing Value Imputation
   ↓
Categorical Encoding
   ↓
Feature Engineering
   ↓
Feature Selection
   ↓
Train/Test Split
   ↓
Model Training
   ↓
Model Evaluation
   ↓
XGBoost Selection
   ↓
Model Serialization
   ↓
FastAPI Deployment
   ↓
Web Application
```

---

## ⚙️ Feature Engineering

The project creates additional features to capture battery behavior.

**Capacity Ratio**

```text
capacity_ratio = remaining_capacity / battery_capacity_kwh
```

Measures the remaining battery capacity relative to its original capacity.

**Temperature Spread**

```text
temp_spread = cell_temperature_max - cell_temperature_avg
```

Measures the difference between maximum and average cell temperature.

**Kilometers Per Year**

```text
km_per_year = odometer_km / (vehicle_age_years + 0.1)
```

Estimates the vehicle's usage intensity.

**Combined Stress**  
A combined stress feature is calculated using multiple battery and driving stress indicators.

---

## 🤖 Models Evaluated

Four classification models were trained and compared:

1. Logistic Regression
2. Random Forest
3. Gradient Boosting
4. XGBoost

---

## 📈 Model Performance

| Model               | Accuracy | Precision | Recall | F1 Score | ROC-AUC |
| ------------------- | -------- | --------- | ------ | -------- | ------- |
| Logistic Regression | 93.55%   | 51.87%    | 95.31% | 67.18%   | 98.47%  |
| Random Forest       | 94.53%   | 60.28%    | 61.37% | 60.82%   | 96.51%  |
| Gradient Boosting   | 96.40%   | 80.93%    | 62.82% | 70.73%   | 98.14%  |
| XGBoost             | 95.97%   | 66.67%    | 83.75% | 74.24%   | 97.99%  |

---

## 🏆 Why XGBoost?

XGBoost was selected as the final model because it achieved the highest F1 score of **74.24%** among the evaluated models.

For battery failure prediction, recall is important because missing a potential failure can be more serious than generating an additional warning.

XGBoost provided a strong balance between:

- Precision: 66.67%
- Recall: 83.75%
- F1 Score: 74.24%
- ROC-AUC: 97.99%

Therefore, XGBoost was selected for the final prediction application.

---

## 🔍 Important Features

Feature importance analysis identified several important battery-related variables, including:

- Thermal runaway risk
- Thermal health score
- Maximum cell temperature
- Battery health percentage
- Previous faults
- Predicted remaining life cycles
- Capacity loss percentage
- Capacity ratio

These features provide useful insights into factors associated with battery failure predictions.

---

## 🛠️ Technology Stack

**Machine Learning**
- Python
- Pandas
- NumPy
- Scikit-learn
- XGBoost

**Backend**
- FastAPI
- Uvicorn
- Jinja2

**Frontend**
- HTML5
- CSS3
- JavaScript

**Tools**
- Jupyter Notebook
- VS Code
- Git
- GitHub

---

## 📁 Project Structure

```text
EV-Battery-Failure-Prediction/
│
├── app.py
├── battery_failure_model.pkl
├── requirements.txt
├── README.md
├── LICENSE
├── .gitignore
│
├── notebooks/
│   └── EV_Battery_Failure_Prediction.ipynb
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js
```

---

## 💻 Installation

1. Clone the repository

```bash
git clone https://github.com/shravandeshmukh2405/EV-Battery-Failure-Prediction.git
```

2. Navigate to the project directory

```bash
cd EV-Battery-Failure-Prediction
```

3. Create a virtual environment

```bash
python -m venv venv
```

4. Activate the environment

**For Windows:**

```bash
venv\Scripts\activate
```

5. Install dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Run the Application

Start the FastAPI server:

```bash
uvicorn app:app --reload
```

Then open:

```
http://127.0.0.1:8000
```

The web application allows users to enter vehicle and battery parameters and receive a battery failure prediction.

---

## 🔌 API

**Prediction Endpoint**

```
POST /predict
```

The API accepts battery and vehicle parameters and returns the predicted class, failure probability, and prediction status.

**Example Response — Healthy Battery**

```json
{
    "prediction": 0,
    "result": "Battery is Healthy",
    "probability": 0.0,
    "status": "safe"
}
```

**Example Response — Failure Risk**

```json
{
    "prediction": 1,
    "result": "Battery Failure Risk Detected",
    "probability": 77.73,
    "status": "danger"
}
```

---

## 🧪 Example Input

Example values for testing the application:

```text
Manufacturing Year: 2022
Odometer: 45000 km
Vehicle Age: 3 years
Cycle Count: 650

Battery Health: 88%
State of Health: 87%
Capacity Loss: 12%
Remaining Capacity: 72 kWh
Battery Capacity: 82 kWh
Remaining Life Cycles: 900
Aging Score: 25
Previous Faults: 1

Maximum Cell Temperature: 42°C
Average Cell Temperature: 30°C
Internal Resistance: 0.045
Thermal Runaway Risk: 15
Thermal Health Score: 85
Temperature Variance: 3.5
Dust Exposure: 20
Cooling System Health: 90

Charge Efficiency: 94
Discharge Efficiency: 93
Voltage Imbalance: 0.08
BMS Warning Count: 2
Abnormal Voltage Events: 1
Maintenance Score: 85

Battery Stress Index: 30
Driving Stress Score: 35
Aggressive Acceleration: 25
Hard Braking Score: 20
```

---

## 🚀 Future Improvements

- Deploy the application to a cloud platform
- Add SHAP-based model explainability
- Add battery health trend visualization
- Add prediction history
- Integrate real-time vehicle telemetry
- Improve probability calibration
- Add automated model retraining
- Add database support for storing predictions

---

## 📌 Disclaimer

This project is developed for educational and demonstration purposes.  
The predictions should not be used as the sole basis for real-world battery safety, maintenance, or replacement decisions.

---

## 👨‍💻 Author

**Shravan Deshmukh**  
B.Tech – CSE / Artificial Intelligence & Machine Learning  

GitHub: [https://github.com/shravandeshmukh2405](https://github.com/shravandeshmukh2405)  
LinkedIn: [https://www.linkedin.com/in/shravan-deshmukh-3ab1872ba](https://www.linkedin.com/in/shravan-deshmukh-3ab1872ba)
```
