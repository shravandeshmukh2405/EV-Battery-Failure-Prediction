// ============================================================
// GET HTML ELEMENTS
// ============================================================

const form = document.getElementById("predictionForm");

const loading = document.getElementById("loading");

const result = document.getElementById("result");

const resultText = document.getElementById("resultText");

const probability = document.getElementById("probability");


// ============================================================
// FORM SUBMISSION
// ============================================================

form.addEventListener("submit", async function (event) {

    // Prevent normal page refresh
    event.preventDefault();


    // Show loading
    loading.classList.remove("hidden");

    // Hide previous result
    result.classList.add("hidden");


    // ========================================================
    // COLLECT INPUT DATA
    // ========================================================

    const data = {

        // ----------------------------------------------------
        // VEHICLE
        // ----------------------------------------------------

        manufacturing_year:
            Number(
                document.getElementById(
                    "manufacturing_year"
                ).value
            ),

        odometer_km:
            Number(
                document.getElementById(
                    "odometer_km"
                ).value
            ),

        vehicle_age_years:
            Number(
                document.getElementById(
                    "vehicle_age_years"
                ).value
            ),

        cycle_count:
            Number(
                document.getElementById(
                    "cycle_count"
                ).value
            ),


        // ----------------------------------------------------
        // BATTERY
        // ----------------------------------------------------

        battery_health_percent:
            Number(
                document.getElementById(
                    "battery_health_percent"
                ).value
            ),

        state_of_health:
            Number(
                document.getElementById(
                    "state_of_health"
                ).value
            ),

        capacity_loss_percent:
            Number(
                document.getElementById(
                    "capacity_loss_percent"
                ).value
            ),

        remaining_capacity:
            Number(
                document.getElementById(
                    "remaining_capacity"
                ).value
            ),

        battery_capacity_kwh:
            Number(
                document.getElementById(
                    "battery_capacity_kwh"
                ).value
            ),

        predicted_remaining_life_cycles:
            Number(
                document.getElementById(
                    "predicted_remaining_life_cycles"
                ).value
            ),

        aging_score:
            Number(
                document.getElementById(
                    "aging_score"
                ).value
            ),

        previous_faults:
            Number(
                document.getElementById(
                    "previous_faults"
                ).value
            ),


        // ----------------------------------------------------
        // THERMAL
        // ----------------------------------------------------

        cell_temperature_max:
            Number(
                document.getElementById(
                    "cell_temperature_max"
                ).value
            ),

        cell_temperature_avg:
            Number(
                document.getElementById(
                    "cell_temperature_avg"
                ).value
            ),

        internal_resistance:
            Number(
                document.getElementById(
                    "internal_resistance"
                ).value
            ),

        thermal_runaway_risk:
            Number(
                document.getElementById(
                    "thermal_runaway_risk"
                ).value
            ),

        thermal_health_score:
            Number(
                document.getElementById(
                    "thermal_health_score"
                ).value
            ),

        temperature_variance:
            Number(
                document.getElementById(
                    "temperature_variance"
                ).value
            ),

        dust_exposure:
            Number(
                document.getElementById(
                    "dust_exposure"
                ).value
            ),

        cooling_system_health:
            Number(
                document.getElementById(
                    "cooling_system_health"
                ).value
            ),


        // ----------------------------------------------------
        // ELECTRICAL
        // ----------------------------------------------------

        charge_efficiency:
            Number(
                document.getElementById(
                    "charge_efficiency"
                ).value
            ),

        discharge_efficiency:
            Number(
                document.getElementById(
                    "discharge_efficiency"
                ).value
            ),

        voltage_imbalance:
            Number(
                document.getElementById(
                    "voltage_imbalance"
                ).value
            ),

        BMS_warning_count:
            Number(
                document.getElementById(
                    "BMS_warning_count"
                ).value
            ),

        abnormal_voltage_events:
            Number(
                document.getElementById(
                    "abnormal_voltage_events"
                ).value
            ),

        maintenance_score:
            Number(
                document.getElementById(
                    "maintenance_score"
                ).value
            ),


        // ----------------------------------------------------
        // DRIVING / STRESS
        // ----------------------------------------------------

        battery_stress_index:
            Number(
                document.getElementById(
                    "battery_stress_index"
                ).value
            ),

        driving_stress_score:
            Number(
                document.getElementById(
                    "driving_stress_score"
                ).value
            ),

        aggressive_acceleration_score:
            Number(
                document.getElementById(
                    "aggressive_acceleration_score"
                ).value
            ),

        hard_braking_score:
            Number(
                document.getElementById(
                    "hard_braking_score"
                ).value
            )

    };


    // ========================================================
    // VALIDATE INPUTS
    // ========================================================

    for (const key in data) {

        if (Number.isNaN(data[key])) {

            loading.classList.add("hidden");

            alert(
                "Please enter a valid value for: " + key
            );

            return;
        }

    }


    // ========================================================
    // DEBUG
    // ========================================================

    console.log(
        "Sending data to FastAPI:",
        data
    );


    // ========================================================
    // SEND REQUEST
    // ========================================================

    try {

        const response = await fetch(
            "/predict",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        // Check HTTP response
        if (!response.ok) {

            throw new Error(
                "Server returned HTTP " +
                response.status
            );

        }


        // Convert response to JSON
        const prediction =
            await response.json();


        console.log(
            "FastAPI response:",
            prediction
        );


        // ====================================================
        // BACKEND ERROR
        // ====================================================

        if (prediction.error) {

            throw new Error(
                prediction.error
            );

        }


        // ====================================================
        // SHOW RESULT
        // ====================================================

        showResult(prediction);


    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );

        alert(
            "Prediction failed:\n\n" +
            error.message
        );


    } finally {

        // Hide loading
        loading.classList.add("hidden");

    }

});


// ============================================================
// DISPLAY RESULT
// ============================================================

function showResult(data) {

    // Show result section
    result.classList.remove("hidden");


    // Convert values to numbers
    const predictionValue =
        Number(data.prediction);

    const probabilityValue =
        Number(data.probability);


    // Display probability
    probability.textContent =
        probabilityValue.toFixed(2);


    // ========================================================
    // BATTERY FAILURE
    // ========================================================

    if (predictionValue === 1) {

        resultText.textContent =
            "Battery Failure Risk Detected";


        result.classList.remove(
            "safe"
        );

        result.classList.add(
            "danger"
        );


        // Change icon
        const icon =
            document.querySelector(
                ".result-icon i"
            );

        icon.className =
            "fa-solid fa-triangle-exclamation";

    }


    // ========================================================
    // HEALTHY BATTERY
    // ========================================================

    else {

        resultText.textContent =
            "Battery is Healthy";


        result.classList.remove(
            "danger"
        );

        result.classList.add(
            "safe"
        );


        // Change icon
        const icon =
            document.querySelector(
                ".result-icon i"
            );

        icon.className =
            "fa-solid fa-check";

    }


    // ========================================================
    // SCROLL TO RESULT
    // ========================================================

    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}