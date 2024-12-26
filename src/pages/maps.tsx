import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import css from "../styles/pages/maps.module.css";
import 'leaflet/dist/leaflet.css';
import CoordinateClass from "../models/CoordinateClass";
import { useEffect, useState } from "react";
import Icons from "../constants/Icons";
import Menu from "../components/menuComponent";
import positionBetweenRadianPoints from "../calculation/positionBetweenRadianPoints";
import saoPaulogeographicCenter from "../constants/saoPauloGeographicCenter";
import { Helmet } from 'react-helmet';

export default function Maps() {
    const [initialCoord, setInitialCoord] = useState<CoordinateClass>(new CoordinateClass({ latitude: 0, longitude: 0 }))
    const [finalCoord, setFinalCoord] = useState<CoordinateClass>(new CoordinateClass({ latitude: 0, longitude: 0 }))
    const [currentCoord, setCurrentCoord] = useState<CoordinateClass>(new CoordinateClass(saoPaulogeographicCenter))

    // async function randomizeCoord() {
    //    let randomCoord = await BackendConnection.getRandomCoord()
    //    console.log(randomCoord)
    // }

    function moveOn(initialCoord: CoordinateClass, finalCoord: CoordinateClass) {
        setInitialCoord(initialCoord)
        setFinalCoord(finalCoord)
        if (localStorage.getItem("inFlight")) return
        localStorage.setItem("inFlight", "in flight")
        let t = 0
        const interval = setInterval(async () => {
            if (t < 1) {
                t += 0.001
                const newCoord = positionBetweenRadianPoints(initialCoord, finalCoord, t)
                setCurrentCoord(newCoord)
            } else {
                clearInterval(interval)
                localStorage.removeItem("inFlight")
            }
        }, 10)
    }

    function LocationClicked() {
        useMapEvents({
            click: (event) => {
                if (localStorage.getItem("inFlight")) return
                const { lat, lng } = event.latlng;
                const clickPointEvent = localStorage.getItem("clickPointEvent")
                if (clickPointEvent) {
                    if (clickPointEvent === "initialPoint") setInitialCoord(new CoordinateClass({ latitude: lat, longitude: lng }))
                    if (clickPointEvent === "finalPoint") setFinalCoord(new CoordinateClass({ latitude: lat, longitude: lng }))
                    localStorage.setItem("eventType", clickPointEvent)
                    localStorage.setItem("lat", `${lat}`)
                    localStorage.setItem("lon", `${lng}`)
                }
                localStorage.removeItem("clickPointEvent")
            },
        });
        return null
    }

    useEffect(() => {
        // randomizeCoord()
        localStorage.removeItem("inFlight")
        localStorage.removeItem("clickPointEvent")
        localStorage.removeItem("eventType")
        localStorage.removeItem("lat")
        localStorage.removeItem("lon")
    }, [])

    return (
        <>
            <Helmet>
                <title>Mapa-Mundi | Sistema de voo de avião</title>
                <link rel="icon" href="%PUBLIC_URL%/favicon-16x16.png" sizes="16x16" />
                <link rel="icon" href="%PUBLIC_URL%/favicon-32x32.png" sizes="32x32" />
                <link rel="apple-touch-icon" href="%PUBLIC_URL%/apple-touch-icon.png" />
                <meta name="theme-color" content="#ffffff" />
            </Helmet>
            <main>
                <MapContainer
                    center={currentCoord.toArray()}
                    zoom={6}
                    className={css.map}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        errorTileUrl="https://upload.wikimedia.org/wikipedia/commons/e/e0/Error.svg"
                    />
                    <Marker position={initialCoord.toArray()} icon={Icons.startIcon} />
                    <Marker position={finalCoord.toArray()} icon={Icons.endIcon} />
                    <Marker position={currentCoord.toArray()} icon={Icons.airplaneIcon} />
                    <LocationClicked />
                    <Menu
                        moveOn={moveOn}
                        info={{
                            currentCoord: currentCoord
                        }}
                    />
                </MapContainer>
            </main>
        </>
    )
}