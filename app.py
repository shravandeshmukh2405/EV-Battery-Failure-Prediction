from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

import pickle
import pandas as pd


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="EV Battery Failure Prediction",
    description="Machine Learning API for EV Battery Failure Prediction",
    version="1.0"
)


# ============================================================
# STATIC FILES AND TEMPLATES
# ============================================================

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)

templates = Jinja2Templates(directory="templates")


# ============================================================
# LOAD TRAINED MODEL
# ============================================================

with open("battery_failure_model.pkl", "rb") as file:
    model_package = pickle.load(file)


model = model_package["model"]
selected_features = model_package["selected_features"]


print("\n==========================================")
print("MODEL LOADED SUCCESSFULLY")
print("==========================================")

print("\nSelected features:")

for feature in selected_features:
    print("-", feature)


# ============================================================
# HOME PAGE
# ============================================================

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )


# ============================================================
# PREDICTION API
# ============================================================

@app.post("/predict")
async def predict(data: dict):

    try:

        # ----------------------------------------------------
        # Convert incoming JSON into DataFrame
        # ----------------------------------------------------

        input_data = pd.DataFrame([data])

        print("\n==========================================")
        print("RECEIVED INPUT")
        print("==========================================")

        print(input_data)


        # ----------------------------------------------------
        # ENGINEERED FEATURE 1
        # Capacity Ratio
        # ----------------------------------------------------

        input_data["capacity_ratio"] = (
            input_data["remaining_capacity"] /
            (input_data["battery_capacity_kwh"] + 1e-6)
        )


        # ----------------------------------------------------
        # ENGINEERED FEATURE 2
        # Temperature Spread
        # ----------------------------------------------------

        input_data["temp_spread"] = (
            input_data["cell_temperature_max"] -
            input_data["cell_temperature_avg"]
        )


        # ----------------------------------------------------
        # ENGINEERED FEATURE 3
        # KM Per Year
        # ----------------------------------------------------

        input_data["km_per_year"] = (
            input_data["odometer_km"] /
            (input_data["vehicle_age_years"] + 0.1)
        )


        # ----------------------------------------------------
        # ENGINEERED FEATURE 4
        # Combined Stress
        # ----------------------------------------------------

        stress_columns = [
            "battery_stress_index",
            "driving_stress_score",
            "aggressive_acceleration_score",
            "hard_braking_score"
        ]

        input_data["combined_stress"] = (
            input_data[stress_columns].mean(axis=1)
        )


        # ----------------------------------------------------
        # CHECK REQUIRED FEATURES
        # ----------------------------------------------------

        missing_features = [
            feature
            for feature in selected_features
            if feature not in input_data.columns
        ]

        if missing_features:

            return {
                "error": (
                    "Missing features: "
                    + ", ".join(missing_features)
                )
            }


        # ----------------------------------------------------
        # KEEP ONLY MODEL FEATURES
        # AND EXACT SAME ORDER AS TRAINING
        # ----------------------------------------------------

        input_data = input_data[selected_features]


        print("\n==========================================")
        print("FINAL MODEL INPUT")
        print("==========================================")

        print(input_data)

        print("\nFeature order:")

        print(input_data.columns.tolist())


        # ----------------------------------------------------
        # XGBOOST PREDICTION
        # ----------------------------------------------------
        #
        # IMPORTANT:
        # XGBoost was trained using UN-SCALED data.
        #
        # Therefore:
        # DO NOT use scaler.transform() here.
        # ----------------------------------------------------

        prediction = model.predict(input_data)[0]

        probability = model.predict_proba(input_data)[0][1]

        probability_percent = float(probability) * 100


        # ----------------------------------------------------
        # RESULT
        # ----------------------------------------------------

        if int(prediction) == 1:

            result = "Battery Failure Risk Detected"
            status = "danger"

        else:

            result = "Battery is Healthy"
            status = "safe"


        # ----------------------------------------------------
        # TERMINAL OUTPUT
        # ----------------------------------------------------

        print("\n==========================================")
        print("PREDICTION RESULT")
        print("==========================================")

        print("Prediction:", int(prediction))

        print(
            "Failure Probability:",
            f"{probability_percent:.2f}%"
        )

        print("Result:", result)

        print("==========================================\n")


        # ----------------------------------------------------
        # SEND RESPONSE TO FRONTEND
        # ----------------------------------------------------

        return {

            "prediction": int(prediction),

            "result": result,

            "probability": round(
                probability_percent,
                2
            ),

            "status": status
        }


    # ========================================================
    # ERROR HANDLING
    # ========================================================

    except Exception as e:

        print("\n==========================================")
        print("PREDICTION ERROR")
        print("==========================================")

        print(str(e))

        return {
            "error": str(e)
        }