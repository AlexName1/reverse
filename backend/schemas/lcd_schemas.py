import decimal
from typing import List, Dict, Optional

from pydantic import BaseModel


class FuelCounter(BaseModel):
    fuel_sleeve: int
    quantity: decimal.Decimal = 0
    price: decimal.Decimal = 0
    amount: decimal.Decimal = 0


class ScreenData(BaseModel):
    fuel_order: List[int]
    counters: Dict[int, FuelCounter]
    ad: Optional[str]
    message: Optional[str]
    theme: str
    components: List[str]
    paddings: List[int]
    font_ratio: float


class Page(BaseModel):
    page: str
    data: dict
