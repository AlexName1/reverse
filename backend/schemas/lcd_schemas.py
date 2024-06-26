import decimal
from typing import List, Dict, Optional

from pydantic import BaseModel


class FuelCounter(BaseModel):
    fuel_sleeve: int
    quantity: decimal.Decimal = 0
    price: decimal.Decimal = 0
    amount: decimal.Decimal = 0


class ScreenData(BaseModel):
    fuel_order: Optional[List[int]] = []
    counters: Dict[int, FuelCounter] = {}
    ad: Optional[str] = None
    message: Optional[str] = None
    theme: str = "dark"
    components: List[str] = []
    paddings: List[int] = []
    font_ratio: float = 1


class Page(BaseModel):
    page: str = "home"
    data: dict = {}


class DataModel(BaseModel):
    data: ScreenData = ScreenData()
    page: Page = Page()
