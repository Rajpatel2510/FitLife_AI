from sqlalchemy import Column, ForeignKey, Integer, Numeric, String, DateTime, func
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
from app.db.database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_onboardings.id", ondelete="CASCADE"), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20))
    height_cm = Column(Numeric(5, 2))
    weight_kg = Column(Numeric(5, 2))
    fitness_goal = Column(String(50))
    fitness_level = Column(String(50))
    activity_level = Column(String(50))
    diet_type = Column(String(50))
    sleep_hours = Column(Numeric(3, 1))
    stress_level = Column(String(50))
    injuries = Column(String(255))
    bmr = Column(Integer)
    tdee = Column(Integer)
    calorie_target = Column(Integer)
    bmi = Column(Numeric(6, 2))

    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="profile")

    # Add foreign key constraint in actual database migration script
    # CONSTRAINT fk_user
    #     FOREIGN KEY (user_id)
    #     REFERENCES users(id)
    #     ON DELETE CASCADE
