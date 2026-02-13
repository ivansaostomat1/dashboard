# backend/models.py
from pydantic import BaseModel
from typing import Optional

class Car(BaseModel):
    Brand: str
    Model: str
    Varian: str
    Price: float
    HorsePower: float
    Torque: float
    BodyType: str
    Sales2025: int
    ScoreFeature: float
    ScoreSafety: float
    ScorePerformance: float
    ScorePopularity: float
    ScoreValue: float

    class Config:
        populate_by_name = True