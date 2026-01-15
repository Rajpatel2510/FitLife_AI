from sqlalchemy import Column, Integer, Boolean, Date, Numeric, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.database import Base

class DailyProgress(Base):
    __tablename__ = "daily_progress"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user_onboardings.id"), nullable=False)
    date = Column(Date, nullable=False)

    workout_completed = Column(Boolean, default=False)
    steps_count = Column(Integer, default=0)
    water_consumed = Column(Numeric(5, 2), default=0)
    sleep_hours = Column(Numeric(4, 1), default=0)

    energy_level = Column(Integer)
    hunger_level = Column(Integer)
    meal_adherence = Column(Integer)

    user = relationship("User", backref="daily_progress")

    __table_args__ = (
        UniqueConstraint("user_id", "date", name="unique_user_day"),
    )