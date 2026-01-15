from sqlalchemy import Column,Integer,String,DateTime,Boolean,ForeignKey,CheckConstraint,JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base
from sqlalchemy.sql import func


class NutritionPlan(Base):
    __tablename__ = "nutrition_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("user_onboardings.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    plan_name = Column(String(100), nullable=True)
    training_days_per_week = Column(Integer, nullable=False)
    plan_data = Column(JSON, nullable=False)  # JSONB in PostgreSQL, JSON in SQLAlchemy
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Constraint to ensure training_days_per_week > 0
    __table_args__ = (
        CheckConstraint(
            "training_days_per_week > 0", name="check_training_days_positive"
        ),
    )

    # Relationship to User
    user = relationship("User", back_populates="nutrition_plans")
