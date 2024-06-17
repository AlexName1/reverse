"use strict";

import './App.css';
import React, {useEffect, useState} from "react";
import Internet from "./icons/Internet.jsx";
import Wifi from "./icons/Wifi.jsx";


let elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

document.onload = function (e) {
    openFullscreen();
}


function RowInfo({label, leftValue, rightValue, theme, sections = 2,}) {
    return (<div className="RowInfo">
            {sections === 2 && <div className={"RowInfo__value " + theme}>{leftValue}</div>}
            <div className={"RowInfo__label " + theme}>{label}</div>
            <div className={"RowInfo__value " + theme}>{rightValue}</div>
        </div>

    )
}


function RowContainer({counters, fuelOrder, theme, components}) {

    const fuelOrderPair = fuelOrder.reduce((result, value, index, array) => {
        if (index % 2 === 0) {
            return [...result, array.slice(index, index + 2)];
        }
        return result
    }, []);

    const showTitle = components.includes('T');
    const showLiter = components.includes('L');
    const showPrice = components.includes('P');
    const showSum = components.includes('S');


    const blankCounter = {
        title: '',
        amount: 0,
        fuel_sleeve: 0,
        price: 0,
        quantity: 0,
    }
    // console.log(fuelOrderPair);

    return (<>
        {fuelOrderPair.map((item, i) => {
            // console.log("Entered");
            // console.log(counters);

            let leftCounter = blankCounter;
            let rightCounter = blankCounter;

            let sections = item.length;

            if (item.length == 2) {
                leftCounter = counters[item[0]];
                rightCounter = counters[item[1]];
            } else if (item.length == 1) {
                rightCounter = counters[item[0]];
            }

            if (leftCounter === undefined) {
                leftCounter = blankCounter;
            }
            if (rightCounter === undefined) {
                rightCounter = blankCounter;
            }

            return (<div>
                {showTitle
                    && <RowInfo
                        label="ЛИТРЫ"
                        leftValue={leftCounter.title}
                        rightValue={rightCounter.title}
                        sections={sections}
                        theme={theme}
                    />
                }
                {showLiter
                    && <RowInfo
                        label="ЛИТРЫ"
                        leftValue={leftCounter.quantity.toFixed(2)}
                        rightValue={rightCounter.quantity.toFixed(2)}
                        sections={sections}
                        theme={theme}
                    />
                }

                {showPrice
                    && <RowInfo
                        label="ЦЕНА"
                        leftValue={leftCounter.price.toFixed(2)}
                        rightValue={rightCounter.price.toFixed(2)}
                        sections={sections}
                        theme={theme}
                    />
                }

                {showSum
                    && <RowInfo
                        label="СУММА" leftValue={leftCounter.amount.toFixed(2)}
                        rightValue={rightCounter.amount.toFixed(2)}
                        sections={sections}
                        theme={theme}
                    />
                }
            </div>)
        })}
    </>)
}

function Ad({ad, theme}) {
    return (
        ad !== undefined && ad !== "" && ad !== null && <div className={"Ad " + theme}>{ad}</div>
    )
}

function MessageBox({message, theme, fontRatio = 1}) {
    return (
        message !== undefined && message !== null && <div
            className={`MessageBox ` + theme}
            style={{fontSize: `calc(100vw / 10 * ${fontRatio})`}}
        >
            <img className="logo" src="/public/GSPay.png" alt=''/>
            <div className="message" dangerouslySetInnerHTML={{__html: message}}></div>
        </div>
    )
}

function Indicator({color, component, initialColor = 'grey'}) {
    const [getColor, setColor] = useState(initialColor)
    const innerComponent = component ? component :
        <div className="Indicator size-indicator" style={{'backgroundColor': color}}>&nbsp;</div>
    return (innerComponent)
}

function IndicatorContainer() {
    let [lanIndicatorStatusColor, setLanIndicatorStatusColor] = useState('green');
    let [serverIndicatorStatusColor, setServerIndicatorStatusColor] = useState('green');

    const internet = <Internet className={`Internet size-indicator ` + serverIndicatorStatusColor}/>
    const wifi = <Wifi className={"Wifi size-indicator " + lanIndicatorStatusColor}/>

    return (<div className="IndicatorContainer" >
        <Indicator key="1" color={serverIndicatorStatusColor} component={internet}/>
        <Indicator key="2" color={lanIndicatorStatusColor} component={wifi}/>
    </div>)
}

function App() {
    const [fuelOrder, setFuelOrder] = useState([])
    const [counters, setCounters] = useState({})
    const [page, setPage] = useState({page: 'home', data: {}})
    const [ad, setAd] = useState(undefined)
    const [message, setMessage] = useState(undefined)
    const [theme, setTheme] = useState('dark')
    const [components, setComponents] = useState([])
    const [fontRatio, setFontRatio] = useState(1)
    const [paddings, setPaddings] = useState([0, 0, 0, 0])

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = new WebSocket("ws://127.0.0.1:8888/ws");
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.onopen = function () {
            console.log("WebSocket connected");
            const eventData = "Event data";
            socket.send(eventData);
        };

        socket.onmessage = function (event) {
            const response = JSON.parse(event.data);
            setFuelOrder(response.data.fuel_order)
            setCounters(response.data.counters)
            setPage(response.page)
            setAd(response.data.ad)
            setTheme(response.data.theme)
            setComponents(response.data.components)
            setPaddings(response.data.paddings)
        };

        socket.onclose = function () {
            console.log("WebSocket closed");
        };

        socket.onerror = () => {
            console.log("WebSocket error");
          };

        return () => {
            socket.close();
        };
    }, [socket]);

    let paddingTop = 0;
    let paddingRight = 0;
    let paddingBottom = 0;
    let paddingLeft = 0;

    if (paddings.length > 0) {
        paddingTop = paddings[0];
    }

    if (paddings.length > 1) {
        paddingRight = paddings[1];
    }

    if (paddings.length > 2) {
        paddingBottom = paddings[2];
    }

    if (paddings.length > 3) {
        paddingLeft = paddings[3];
    }

    const paddingStype = {
        paddingTop: paddingTop,
        paddingRight: paddingRight,
        paddingBottom: paddingBottom,
        paddingLeft: paddingLeft
    };

    let contentComponent = <>
        <RowContainer fuelOrder={fuelOrder} counters={counters} theme={theme} components={components}/>
        <MessageBox message={message} theme={theme} fontRatio={fontRatio}/>
        <Ad ad={ad} theme={theme}/>
    </>

    if (page.page === 'dut_level') {
        contentComponent = <div
            className={`MessageBox ` + theme}
            style={{fontSize: `calc(100vw / 20 * ${fontRatio})`}}
        >
            <div>
                <div className="message">Номер ДУТ: {page.data.number_fuel}</div> <br/>
                <div className="message">Заполнение: {page.data.filled_percent.toFixed(2)} %</div>
                <div className="message">Температура: {page.data.temperature_fuel.toFixed(2)} ℃</div>
                <div className="message">Объем: {page.data.main_volume_fuel.toFixed(4)} м3</div>
                <div className="message">Масса: {page.data.mass_fuel.toFixed(4)} </div>
                <div className="message">Плотность: {page.data.density_fuel.toFixed(4)} </div>
            </div>

        </div>
    }


    return (
        <div
            className={`App ` + theme}
            style={paddingStype}
        >
            {contentComponent}
            <IndicatorContainer/>
        </div>
    );
}

export default App;
