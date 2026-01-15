-- =====================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- File: 002_indexes.sql
-- Run AFTER all tables are created
-- =====================================================


-- ===============================
-- USERS TABLE INDEXES
-- ===============================

-- Fast lookup by email (login / onboarding)
CREATE INDEX idx_users_email
ON users(email);

-- Fast lookup by created time (analytics, sorting)
CREATE INDEX idx_users_created_at
ON users(created_at);



-- ===============================
-- USER PROFILES TABLE INDEXES
-- ===============================

-- Fast join between users and profiles
CREATE INDEX idx_user_profiles_user_id
ON user_profiles(user_id);

-- Optional: filter users by fitness goal
CREATE INDEX idx_user_profiles_fitness_goal
ON user_profiles(fitness_goal);



-- ===============================
-- WORKOUT PLANS TABLE INDEXES
-- ===============================

-- Fast lookup of workouts by user
CREATE INDEX idx_workout_plans_user_id
ON workout_plans(user_id);

-- Fast retrieval of latest workout plan
CREATE INDEX idx_workout_plans_created_at
ON workout_plans(created_at);



-- ===============================
-- MEAL PLANS TABLE INDEXES
-- ===============================

-- Fast lookup of meals by user
CREATE INDEX idx_meal_plans_user_id
ON meal_plans(user_id);

-- Fast retrieval of latest meal plan
CREATE INDEX idx_meal_plans_created_at
ON meal_plans(created_at);



-- ===============================
-- COMPOSITE INDEXES (ADVANCED BUT USEFUL)
-- ===============================

-- Get latest workout plan for a user very fast
CREATE INDEX idx_workout_user_latest
ON workout_plans(user_id, created_at DESC);

-- Get latest meal plan for a user very fast
CREATE INDEX idx_meal_user_latest
ON meal_plans(user_id, created_at DESC);
