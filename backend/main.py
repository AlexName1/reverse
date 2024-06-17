import os
from typing import List, Optional

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import random
from pydantic import BaseModel

from schemas import lcd_schemas


# Create application
app = FastAPI()

# app.mount("/static", StaticFiles(directory="public/static"), name="static")
# app.mount("/public", StaticFiles(directory="public"), name="public")


origins = [
    "http://localhost:8888",
    "http://127.0.0.1:8888",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:7780",
    "http://127.0.0.1:7780",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


home_page = lcd_schemas.Page(page="home", data={})


class DataModel:
    data: lcd_schemas.ScreenData
    page: lcd_schemas.Page = home_page

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.data = lcd_schemas.ScreenData(
            fuel_order=[],
            counters={},
            ad=None,
            message=None,
            theme="light",
            components=[],
            paddings=[],
            font_ratio=1,
        )


lcd_data: DataModel = DataModel()


class Message(BaseModel):
    message: str


class FontRatio(BaseModel):
    ratio: float


class FuelOrder(BaseModel):
    fuel_order: Optional[List[int]]


class Paddings(BaseModel):
    paddings: List[int]


class Theme(BaseModel):
    theme: str


class Components(BaseModel):
    components: List[str]


# getters
@app.post("/get-theme/")
async def get_theme():
    return lcd_data.data.theme


@app.post("/get-components/")
async def get_components():
    return lcd_data.data.components


@app.post("/get-paddings/")
async def get_paddings():
    return lcd_data.data.paddings


@app.post("/get-fuel-order/")
async def get_fuel_order():
    return lcd_data.data.fuel_order


@app.post("/get-counters/")
async def get_counters():
    return lcd_data.data.counters


@app.post("/get-message/")
async def get_message():
    return lcd_data.data.message


@app.post("/get-page/")
async def get_page():
    return lcd_data.page


@app.post("/get-ad/")
async def get_ad():
    return lcd_data.data.ad


@app.post("/get-font-ratio/")
async def get_font_ratio():
    return lcd_data.data.font_ratio


# setters
@app.post("/set-data/")
async def set_data(data: lcd_schemas.ScreenData):
    lcd_data.data = data
    return True


@app.post("/set-message/")
async def set_message(message: Message):
    lcd_data.data.message = message.message
    return True


@app.post("/set-ad/")
async def set_ad(ad: Message):
    lcd_data.data.ad = ad.message
    return True


@app.post("/set-font-ratio/")
async def set_font_ratio(ratio: FontRatio):
    lcd_data.data.font_ratio = ratio.ratio
    return True


@app.post("/set-theme/")
async def set_theme(theme: Theme):
    lcd_data.data.theme = theme.theme
    return True


@app.post("/set-components/")
async def set_components(components: Components):
    lcd_data.data.components = components.components
    return True


@app.post("/set-fuel-order/")
async def set_fuel_order(fuel_order: FuelOrder):
    lcd_data.data.fuel_order = fuel_order.fuel_order
    return True


@app.post("/set-fuel-counter/")
async def set_fuel_counter(fuel_counter: lcd_schemas.FuelCounter):
    lcd_data.data.counters[fuel_counter.fuel_sleeve] = fuel_counter
    return True


@app.post("/set-paddings/")
async def set_paddings(paddings: Paddings):
    lcd_data.data.paddings = paddings.paddings
    return True


@app.post("/set-page/")
async def set_page(page: lcd_schemas.Page):
    lcd_data.page = page
    return True


@app.post("/shutdown/")
async def shutdown():
    os.system("sudo shutdown -h now")
    return True


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print('a new websocket to create.')
    await websocket.accept()
    while True:
        try:
            # Wait for any message from the client
            await websocket.receive_text()
            # Send message to the client
            resp = {'value': random.uniform(0, 1)}
            await websocket.send_json(resp)
        except Exception as e:
            print('error:', e)
            break
    print('Bye..')
