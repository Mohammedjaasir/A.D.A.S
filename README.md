# Autonomous Decision Making AI-Scientist 

---

<img width="959" height="475" alt="image" src="https://github.com/user-attachments/assets/ca5eb34a-6a24-4528-9208-b92fb4b1675c" />


An autonomous multi-agent AI system that checks data trustworthiness before applying Machine Learning, Deep Learning, and Generative AI.

---

🚩 Problem Statement

AI systems today make confident decisions without verifying whether the data itself is reliable.
Bad or incomplete data can still produce high accuracy, leading to unsafe and misleading outcomes.

ADAS solves this by making AI think before acting.

---

🎯 Project Objective

The objective of ADAS is to build an Autonomous AI Scientist that:

- Validates data quality before modeling

- Stops execution if data is unsafe

- Automatically performs data analysis, ML, DS validation, DL (if justified)

- Generates visual evidence and human-readable explanations

- Works across any domain tabular dataset

---

🧩 What This Project Does

ADAS follows a decision-first AI pipeline:

1.Accepts a dataset (CSV)

2.Checks data quality using defined thresholds

3.Stops automation if data is unreliable

4.If data is reliable:

--Performs data analysis

--Trains ML models

--Validates results scientifically

--Applies Deep Learning only when needed

--Generates visualizations

--Explains decisions using Generative AI

The system can say “STOP” — which most AI systems cannot.

---

🤖 Multi-Agent Architecture

ADAS uses a multi-agent design, where each agent has a clear responsibility:

| Agent                   | Role                                 |
| ----------------------- | ------------------------------------ |
| **Data Quality Agent**  | Checks data trustworthiness          |
| **Analyst Agent**       | Cleans data and generates insights   |
| **ML Agent**            | Selects and trains ML models         |
| **Data Science Agent**  | Validates stability, bias, and trust |
| **Deep Learning Agent** | Applies DL only if data justifies it |
| **GenAI Agent**         | Explains results and visualizations  |

Agents work together under a central orchestrator.

---

📊 Threshold-Based Decision System (0–1 Scale)

ADAS uses normalized threshold values between 0 and 1:

-0.0 → No trust

-0.7 → Minimum acceptable trust

-1.0 → High confidence

If trust ≥ 0.7 → Continue automation
If trust < 0.7 → Stop or warn

This prevents blind automation.

---

📈 Visualizations Used

Visualizations are generated only when necessary to justify decisions:

-Missing value heatmap

-Target distribution

-Correlation heatmap

-Feature importance

-Confusion matrix / residual plots

-Learning curves (only if DL is used)

Visuals are used as evidence, not decoration.

---

🛠️ Technologies Used

Backend

-Python

-FastAPI

-Pandas, NumPy

-Scikit-learn

-XGBoost / LightGBM (optional)

-PyTorch (conditional Deep Learning)

Generative AI

-OpenAI GPT (used only for explanation, not modeling)

-Visualization

-Matplotlib

-Seaborn

-Chart.js / Recharts (frontend)

Frontend

-HTML, CSS, React

---

🧠 Key Features

✅ Autonomous decision-making

✅ Multi-agent AI architecture

✅ Stop-on-bad-data logic

✅ Explainable AI reasoning

✅ Domain-independent design

✅ Research + hackathon ready

---

🏆 Why ADAS Is Different

| Aspect                 | Traditional AI | ADAS |
| ---------------------- | -------------- | ---- |
| Trains blindly         | ✅              | ❌    |
| Validates data first   | ❌              | ✅    |
| Can stop execution     | ❌              | ✅    |
| Uses DL only if needed | ❌              | ✅    |
| Explains decisions     | ❌              | ✅    |

---

🚀 Future Enhancements

-Support for time-series and image datasets

-Live agent communication visualization

-Model memory and learning from past runs

-Cloud and Docker deployment




