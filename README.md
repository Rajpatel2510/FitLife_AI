# FitLife AI - Intelligent Fitness & Nutrition Planning System

FitLife AI is an AI-powered fitness and nutrition assistant designed to automate personalized workout and meal planning using intelligent agent workflows. The system analyzes detailed user onboarding data, lifestyle habits, fitness goals, and health conditions to generate structured weekly plans and continuously track user progress for sustainable, long-term fitness improvement.

---

## Key Features

* **User Onboarding & Profiling**

  * Collects personal details, body measurements, fitness goals, activity level, diet preferences, injuries, and lifestyle habits.

* **AI-Generated Workout Plans**

  * Generates goal-driven, injury-aware weekly workout plans.
  * Supports Full Body, Upper/Lower, and Push–Pull–Legs splits.
  * Automatically inserts rest days while maintaining workout integrity.

* **Personalized Meal Planning**

  * Creates balanced weekly meal plans aligned with workout intensity and fitness goals.
  * Supports diet preferences, allergies, and calorie distribution.

* **Habit Logging & Progress Tracking**

  * Tracks workout consistency, meal adherence, and weight changes.
  * Converts raw activity data into clear fitness insights.

* **Analytics & Insights**

  * Visualizes progress trends and adherence metrics.
  * Helps users stay motivated and accountable.

---

## System Architecture Overview

FitLife AI follows an **AI Agent–based architecture** using LangGraph-style workflows:

1. **User Onboarding Agent** – Builds a complete fitness profile.
2. **Workout Planning Agent** – Generates structured workout days based on user constraints.
3. **Meal Planning Agent** – Aligns nutrition with training load and goals.
4. **Plan Formatting Agent** – Inserts rest days and finalizes weekly schedules.
5. **Persistence Agent** – Stores plans as long-term memory in the database.
6. **Analytics Agent (Optional)** – Evaluates progress and trends over time.

---

## Tech Stack

* **Backend:** FastAPI
* **AI Orchestration:** LangGraph (Agent-based workflows)
* **LLMs:** OpenAI / compatible LLM providers
* **Database:** PostgreSQL (SQLAlchemy ORM)
* **Authentication:** JWT-based security
* **Data Validation:** Pydantic

---

## Project Structure

```
app/
 ├── ai/
 │   ├── agents/
 │   ├── graphs/
 │   ├── nodes/
 │   └── llm/
 ├── api/
 │   └── route/
 ├── db/
 ├── models/
 ├── schemas/
 └── main.py
```

---

## Workflow Example

1. User completes onboarding.
2. Workout agent analyzes fitness readiness, equipment, and injuries.
3. Meal agent generates nutrition aligned with workout load.
4. System formats a full 7-day plan.
5. Plan is stored as the user’s active fitness plan.
6. Progress data updates analytics over time.

---

## Use Cases

* Beginners looking for safe, guided fitness plans.
* Busy professionals needing automated fitness planning.
* Long-term fitness tracking with adaptive recommendations.
* AI agent experimentation for real-world health applications.
