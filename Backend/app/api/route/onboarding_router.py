from fastapi import APIRouter,Depends,HTTPException
from app.models.user_model import User
from app.models.user_profile_model import UserProfile
from app.schemas.onboarding_schema import OnboardingUserSchema, OnboardingUserProfileSchema, LoginSchema
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.authentication.auth import hash_password,verify_password,create_acess_token,decode_access_token
from fastapi.security import HTTPAuthorizationCredentials
from app.authentication.auth import security
from app.services.onboarding_service import convert_height_to_cm,convert_weight_to_kg
from app.models.workout_plan_model import WorkoutPlan
from app.models.nutrition_plan_model import NutritionPlan

router = APIRouter(prefix="/onboarding",tags=['onboarding'])

@router.post("/create_user")
def create_user(user: OnboardingUserSchema, db: Session = Depends(get_db)):
    user_email = user.email.lower().strip()
    existing_user = db.query(User).filter(User.email == user_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = hash_password(user.password)

    # Process the user data here
    new_user = User(
        name=user.name,
        email=user_email,
        password_hash=hashed_password
        )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))   
    
    data = {
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
        "created_at": new_user.created_at,
    }

    return {"message": "User created successfully", "user": data}

@router.post("/login")
def login(credentials: LoginSchema, db: Session = Depends(get_db)):
    user_email = credentials.email.lower().strip()
    user = db.query(User).filter(User.email == user_email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_acess_token(data={"user_id": user.id, "email": user.email})

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/protected-route")
def protected_route(credentials:HTTPAuthorizationCredentials=Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401,detail="Credentials missing")
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401,detail="Invalid or expired token")
    return {
        "message":"Access granted to protected route",
        "user":payload
    }


@router.get("/me")
def get_current_user_data(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Credentials missing")

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("user_id")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch profile
    user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    # Fetch active workout plan
    latest_workout = (
        db.query(WorkoutPlan)
        .filter(WorkoutPlan.user_id == user_id, WorkoutPlan.is_active == True)
        .order_by(WorkoutPlan.created_at.desc())
        .first()
    )

    workout_plan_data = None
    if latest_workout and latest_workout.workout_plan_data:
        workout_plan_data = latest_workout.workout_plan_data
        if isinstance(workout_plan_data, dict):
            workout_plan_data["id"] = str(latest_workout.id)

    # ✅ Fetch active nutrition plan (THIS IS THE ONE THAT MATTERS)
    latest_meal = (
        db.query(NutritionPlan)
        .filter(NutritionPlan.user_id == user_id, NutritionPlan.is_active == True)
        .order_by(NutritionPlan.created_at.desc())
        .first()
    )

    meal_plan_data = None
    if latest_meal and latest_meal.plan_data:
        meal_plan_data = latest_meal.plan_data
        if isinstance(meal_plan_data, dict):
            meal_plan_data["id"] = str(latest_meal.id)

    
    # Construct profile response
    profile_data = None
    if user_profile:
        profile_data = {
            "id": user_profile.id,
            "user_id": user_profile.user_id,
            "age": user_profile.age,
            "gender": user_profile.gender,
            "height_cm": float(user_profile.height_cm) if user_profile.height_cm else None,
            "weight_kg": float(user_profile.weight_kg) if user_profile.weight_kg else None,
            "fitness_goal": user_profile.fitness_goal,
            "fitness_level": user_profile.fitness_level,
            "activity_level": user_profile.activity_level,
            "diet_type": user_profile.diet_type,
            "sleep_hours": float(user_profile.sleep_hours) if user_profile.sleep_hours else None,
            "stress_level": user_profile.stress_level,
            "injuries": user_profile.injuries,
            "updated_at": user_profile.updated_at,
        }

        try:
            if profile_data["weight_kg"] and profile_data["height_cm"]:
                profile_data["bmi"] = profile_data["weight_kg"] / (profile_data["height_cm"] / 100) ** 2
                s = 5 if profile_data["gender"] == "male" else -161
                profile_data["bmr"] = (
                    10 * profile_data["weight_kg"]
                    + 6.25 * profile_data["height_cm"]
                    - 5 * profile_data["age"]
                    + s
                )
                multiplier = {
                    "sedentary": 1.2,
                    "lightly_active": 1.375,
                    "moderate": 1.55,
                    "very_active": 1.725,
                    "extremely_active": 1.9,
                }.get(profile_data["activity_level"], 1.55)
                profile_data["tdee"] = profile_data["bmr"] * multiplier

                profile_data["name"] = user.name
                profile_data["allergies_restrictions"] = []
                profile_data["food_dislikes"] = []
                profile_data["available_equipment"] = []
                profile_data["injury_pain_conditions"] = (
                    [profile_data["injuries"]] if profile_data["injuries"] else []
                )
                profile_data["calorie_target"] = (
                profile_data["tdee"] - 500
                if profile_data["fitness_goal"] == "weight_loss"
                else profile_data["tdee"] + 300
                if profile_data["fitness_goal"] == "muscle_gain"
                else profile_data["tdee"]
            )
        except Exception as e:
            print(f"Error calculating metrics: {e}")

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        },
        "profile": profile_data,
        "workout_plan": workout_plan_data,
        "meal_plan": meal_plan_data,  
    }



@router.post("/create_user_profile/{user_id}")
def create_user_profile(user_id: int,profile:OnboardingUserProfileSchema,credentials:HTTPAuthorizationCredentials=Depends(security),db:Session=Depends(get_db),):
    try:
        height_cm = convert_height_to_cm(
            profile.height_unit,
            height_cm=profile.height_cm,
            height_ft=profile.height_ft,
            height_in=profile.height_in,
        )
    except Exception:
        height_cm = profile.height_cm

    try:
        weight_kg = convert_weight_to_kg(profile.weight_value, profile.weight_unit)
    except Exception:
        # Fallback to provided weight value if conversion fails
        weight_kg = profile.weight_value


    try:
        if weight_kg and height_cm:
            bmi = weight_kg / (height_cm/ 100) ** 2
            s = 5 if profile.gender == "male" else -161
            bmr = (10 * weight_kg + 6.25 * height_cm - 5 * profile.age + s)
            multiplier = {
                "sedentary": 1.2,
                "lightly_active": 1.375,
                "moderate": 1.55,
                "very_active": 1.725,
                "extremely_active": 1.9,
            }.get(profile.activity_level, 1.55)
            tdee = bmr * multiplier
            calorie_target = (
                tdee - 500
                if profile.fitness_goal == "weight_loss"
                else tdee + 300
                if profile.fitness_goal == "muscle_gain"
                else tdee)


            # profile_data["name"] = user.name
            # profile_data["allergies_restrictions"] = []
            # profile_data["food_dislikes"] = []
            # profile_data["available_equipment"] = []
            # profile_data["injury_pain_conditions"] = (
            # [profile_data["injuries"]] if profile_data["injuries"] else []
            #     )
    except Exception as e:
        print(f"Error calculating metrics: {e}")



    user_profile = UserProfile(
        user_id=user_id,
        age=profile.age,
        gender=profile.gender,
        height_cm=height_cm,
        weight_kg=weight_kg,
        fitness_goal=profile.fitness_goal,
        fitness_level=profile.fitness_level,
        activity_level=profile.activity_level,
        diet_type=profile.diet_type,
        sleep_hours=profile.sleep_duration_hours,
        stress_level=profile.stress_level,
        injuries=profile.injury_pain_conditions,
        bmi=bmi,
        bmr=bmr,
        tdee=tdee,
        calorie_target=calorie_target,
        updated_at=None
    )

    print(f"BMI : {bmi}")
    print(f"BMR : {bmr}")
    print(f"TDEE : {tdee}")

    # if user_profile["weight_kg"] and user_profile["height_cm"]:
    #             user_profile["bmi"] = user_profile["weight_kg"] / (user_profile["height_cm"] / 100) ** 2
    #             s = 5 if user_profile["gender"] == "male" else -161
    #             user_profile["bmr"] = (
    #                 10 * user_profile["weight_kg"]
    #                 + 6.25 * user_profile["height_cm"]
    #                 - 5 * user_profile["age"]
    #                 + s
    #             )
    #             multiplier = {
    #                 "sedentary": 1.2,
    #                 "lightly_active": 1.375,
    #                 "moderate": 1.55,
    #                 "very_active": 1.725,
    #                 "extremely_active": 1.9,
    #             }.get(user_profile["activity_level"], 1.55)
    #             user_profile["tdee"] = user_profile["bmr"] * multiplier

    #             user_profile["name"] = user.name
    #             user_profile["allergies_restrictions"] = []
    #             user_profile["food_dislikes"] = []
    #             user_profile["available_equipment"] = []
    #             user_profile["injury_pain_conditions"] = (
    #                 [user_profile["injuries"]] if user_profile["injuries"] else []
    #             )
    try:
        db.add(user_profile)
        db.commit()
        db.refresh(user_profile)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
    data = {
        "id": user_profile.id,
        "user_id": user_profile.user_id,
        "age": user_profile.age,
        "gender": user_profile.gender,
        "height_cm": float(user_profile.height_cm) if user_profile.height_cm else None,
        "weight_kg": float(user_profile.weight_kg) if user_profile.weight_kg else None,
        "fitness_goal": user_profile.fitness_goal,
        "fitness_level": user_profile.fitness_level,
        "activity_level": user_profile.activity_level,
        "diet_type": user_profile.diet_type,
        "sleep_hours": float(user_profile.sleep_hours) if user_profile.sleep_hours else None,
        "stress_level": user_profile.stress_level,
        "injuries": user_profile.injuries,
        "updated_at": user_profile.updated_at
    }

    return {
        "message":"User profile created successfully",
        "user_profile":data
    }