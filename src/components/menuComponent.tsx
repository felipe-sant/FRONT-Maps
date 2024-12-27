import { useEffect, useState } from "react"
import Icons from "../constants/Icons"
import CoordinateClass from "../models/CoordinateClass"
import css from "../styles/components/menu.module.css"
import MenuProps from "../types/props/menuProps"
import BackendConnection from "../connection/BackendConnection"
import Locality from "../types/LocalityType"

export default function Menu(props: MenuProps) {
    const { moveOn, info } = props
    const [initialCoordLatitude, setInitialCoordLatitude] = useState<string>('')
    const [initialCoordLongitude, setInitialCoordLongitude] = useState<string>('')
    const [finalCoordLatitude, setFinalCoordLatitude] = useState<string>('')
    const [finalCoordLongitude, setFinalCoordLongitude] = useState<string>('')
    const [initialCoordButtonClicked, setInitialCoordButtonClicked] = useState<boolean>(false)
    const [finalCoordButtonClicked, setFinalCoordButtonClicked] = useState<boolean>(false)
    const [country, setCountry] = useState<string | undefined>(undefined)
    const [state, setState] = useState<string | undefined>(undefined)
    const [municipality, setMunicipality] = useState<string | undefined>(undefined)
    const [microregion, setMicroregion] = useState<string | undefined>(undefined)
    const [mesoregion, setMesoregion] = useState<string | undefined>(undefined)
    const [inFlight, setInFlight] = useState<boolean>(false)
    const initialPointClick = () => localStorage.setItem("clickPointEvent", "initialPoint")
    const finalPointClick = () => localStorage.setItem("clickPointEvent", "finalPoint")

    async function updateLocation(coord: CoordinateClass) {
        const locality: Locality | undefined = await BackendConnection.getLocation(coord)
        if (!locality) {
            setCountry(undefined)
            setState(undefined)
            setMunicipality(undefined)
            setMicroregion(undefined)
            setMesoregion(undefined)
            return
        } else {
            setCountry(locality.country)
            setState(locality.state)
            setMunicipality(locality.municipality)
            setMicroregion(locality.microregion)
            setMesoregion(locality.mesoregion)
        }
    }

    async function start() {
        const initialCoordLatitudeNumber = parseFloat(initialCoordLatitude)
        const initialCoordLongitudeNumber = parseFloat(initialCoordLongitude)
        const finalCoordLatitudeNumber = parseFloat(finalCoordLatitude)
        const finalCoordLongitudeNumber = parseFloat(finalCoordLongitude)
        if (Number.isNaN(initialCoordLatitudeNumber) || Number.isNaN(initialCoordLongitudeNumber) || Number.isNaN(finalCoordLatitudeNumber) || Number.isNaN(finalCoordLongitudeNumber)) {
            moveOn(undefined, undefined, updateLocation)
            return
        }
        const initialCoord: CoordinateClass = new CoordinateClass({ latitude: initialCoordLatitudeNumber, longitude: initialCoordLongitudeNumber })
        await updateLocation(initialCoord)
        const finalCoord: CoordinateClass = new CoordinateClass({ latitude: finalCoordLatitudeNumber, longitude: finalCoordLongitudeNumber })
        moveOn(
            initialCoord,
            finalCoord,
            updateLocation,
        )
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (localStorage.getItem("inFlight")) {
                setInFlight(true)
            } else {
                setInFlight(false)
            }

            if (localStorage.getItem("clickPointEvent") === "initialPoint") {
                setInitialCoordButtonClicked(true)
            } else {
                setInitialCoordButtonClicked(false)
            }

            if (localStorage.getItem("clickPointEvent") === "finalPoint") {
                setFinalCoordButtonClicked(true)
            } else {
                setFinalCoordButtonClicked(false)
            }

            const eventType = localStorage.getItem("eventType")
            if (eventType) {
                const lat = localStorage.getItem("lat")
                const lon = localStorage.getItem("lon")
                if (eventType === "initialPoint") {
                    if (lat) setInitialCoordLatitude(lat)
                    if (lon) setInitialCoordLongitude(lon)
                }
                if (eventType === "finalPoint") {
                    if (lat) setFinalCoordLatitude(lat)
                    if (lon) setFinalCoordLongitude(lon)
                }
                localStorage.removeItem("eventType")
                localStorage.removeItem("lat")
                localStorage.removeItem("lon")
            }
        }, 10);

        return () => {
            clearInterval(interval); // Limpa o intervalo ao desmontar o componente
        };
    }, []);

    return (
        <>
            <div className={css.menu}>
                {inFlight ? <>
                    <div className={css.info}>
                        <label>
                            <img src={Icons.airplaneIconUrl} alt="Start Icon" />
                            Coordenada Atual:
                            <span>{info.currentCoord.latitude.toFixed(2)}° | {info.currentCoord.longitude.toFixed(2)}°</span>
                        </label>
                        <hr />
                        <div className={css.locality}>
                            {country ? <label>País:<span> {country}</span></label> : <label>País:<span> Desconhecido</span></label>}
                            {state ? <label>Estado:<span> {state}</span></label> : <label>Estado:<span> Desconhecido</span></label>}
                            {municipality ? <label>Município:<span> {municipality}</span></label> : <label>Município:<span> Desconhecido</span></label>}
                            {microregion ? <label>Microregião:<span> {microregion}</span></label> : <label>Microregião:<span> Desconhecido</span></label>}
                            {mesoregion ? <label>Mesorregião:<span> {mesoregion}</span></label> : <label>Mesorregião:<span> Desconhecido</span></label>}
                        </div>
                    </div>
                </> : <>
                    <div className={css.play}>
                        <div className={css.input}>
                            <label>
                                <img src={Icons.startIconUrl} alt="Start Icon" />
                                Coordenada Inicial
                                <button onClick={initialPointClick} className={initialCoordButtonClicked ? css.clicked : ""}>🎯</button>
                            </label>
                            <div className={css.inputs}>
                                <input
                                    type="number"
                                    placeholder="lat"
                                    value={initialCoordLatitude}
                                    onChange={(e) => setInitialCoordLatitude(e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="lon"
                                    value={initialCoordLongitude}
                                    onChange={(e) => setInitialCoordLongitude(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={css.input}>
                            <label>
                                <img src={Icons.endIconUrl} alt="End Icon" />
                                Coordenada Final
                                <button onClick={finalPointClick} className={finalCoordButtonClicked ? css.clicked : ""}>🎯</button>
                            </label>
                            <div className={css.inputs}>
                                <input
                                    type="number"
                                    placeholder="lat"
                                    value={finalCoordLatitude}
                                    onChange={(e) => setFinalCoordLatitude(e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="lon"
                                    value={finalCoordLongitude}
                                    onChange={(e) => setFinalCoordLongitude(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={css.button}>
                        <button onClick={start}>Viajar!</button>
                    </div>
                </>}
            </div>
        </>
    )
}