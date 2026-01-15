-- user table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- user profile table
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0),
    gender VARCHAR(20),
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    fitness_goal VARCHAR(50),
    fitness_level VARCHAR(50),
    activity_level VARCHAR(50),
    diet_type VARCHAR(50),
    sleep_hours NUMERIC(3,1),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    injuries TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- workout plans table
CREATE TABLE workout_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    plan_name VARCHAR(100),
    training_days_per_week INTEGER CHECK (training_days_per_week > 0),
    plan_data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_workout_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- meal plans table
CREATE TABLE meal_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    daily_calories NUMERIC(6,2) CHECK (daily_calories > 0),
    protein_g NUMERIC(6,2),
    carbs_g NUMERIC(6,2),
    fats_g NUMERIC(6,2),
    meals JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_meal_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- daily logs table
CREATE TABLE daily_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    log_date DATE NOT NULL,
    workout_completed BOOLEAN DEFAULT FALSE,
    meal_adherence_percent INTEGER CHECK (meal_adherence_percent BETWEEN 0 AND 100),
    weight_kg NUMERIC(5,2),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    sleep_hours NUMERIC(3,1),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_log_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_log
        UNIQUE (user_id, log_date)
);


-- progress summaries table
CREATE TABLE progress_summaries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    period VARCHAR(20) NOT NULL,
    weight_change NUMERIC(5,2),
    consistency_score INTEGER CHECK (consistency_score BETWEEN 0 AND 100),
    workout_adherence INTEGER CHECK (workout_adherence BETWEEN 0 AND 100),
    diet_adherence INTEGER CHECK (diet_adherence BETWEEN 0 AND 100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_progress_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ai plan history table
CREATE TABLE ai_plan_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    old_workout_plan_id INTEGER,
    new_workout_plan_id INTEGER,
    old_meal_plan_id INTEGER,
    new_meal_plan_id INTEGER,
    change_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_history_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
