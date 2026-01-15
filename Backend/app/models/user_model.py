from sqlalchemy import Column, Integer, String, DateTime,Boolean
from sqlalchemy.orm import declarative_base,relationship
from datetime import datetime
from app.db.database import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "user_onboardings"

    id = Column(Integer,primary_key=True,index=True)
    name = Column(String,nullable=False)
    email = Column(String,unique=True,nullable=False,index=True)
    # created_at = Column(DateTime,default=lambda:datetime.now())
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    # created_at = Column(DateTime(timezone=True),server_default=func.now())
    created_at = Column(DateTime,nullable=False,default=datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    workout_plans = relationship("WorkoutPlan", back_populates="user")
    nutrition_plans = relationship("NutritionPlan", back_populates="user")
