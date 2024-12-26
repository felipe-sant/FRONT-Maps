import { useEffect, useState } from "react"
import brazilianGeographicCenter from "../constants/brazilianGeographicCenter"
import Icons from "../constants/Icons"
import CoordinateClass from "../models/CoordinateClass"
import css from "../styles/components/menu.module.css"
import MenuProps from "../types/props/menuProps"

export default function Menu(props: MenuProps) {
    const { moveOn, info } = props
    const [initialCoordLatitude, setInitialCoordLatitude] = useState<string>('')
    const [initialCoordLongitude, setInitialCoordLongitude] = useState<string>('')
    const [finalCoordLatitude, setFinalCoordLatitude] = useState<string>('')
    const [finalCoordLongitude, setFinalCoordLongitude] = useState<string>('')
    const [initialCoordButtonClicked, setInitialCoordButtonClicked] = useState<boolean>(false)
    const [finalCoordButtonClicked, setFinalCoordButtonClicked] = useState<boolean>(false)

    function start() {
        const initialCoordLatitudeNumber = parseFloat(initialCoordLatitude)
        const initialCoordLongitudeNumber = parseFloat(initialCoordLongitude)
        const finalCoordLatitudeNumber = parseFloat(finalCoordLatitude)
        const finalCoordLongitudeNumber = parseFloat(finalCoordLongitude)

        if (Number.isNaN(initialCoordLatitudeNumber)) return
        if (Number.isNaN(initialCoordLongitudeNumber)) return
        if (Number.isNaN(finalCoordLatitudeNumber)) return
        if (Number.isNaN(finalCoordLongitudeNumber)) return

        const initialCoord: CoordinateClass = new CoordinateClass({ latitude: initialCoordLatitudeNumber, longitude: initialCoordLongitudeNumber })
        const finalCoord: CoordinateClass = new CoordinateClass({ latitude: finalCoordLatitudeNumber, longitude: finalCoordLongitudeNumber })

        moveOn(
            initialCoord,
            finalCoord
        )
    }

    function initialPointClick() {
        localStorage.setItem("clickPointEvent", "initialPoint")
    }

    function finalPointClick() {
        localStorage.setItem("clickPointEvent", "finalPoint")
    }

    useEffect(() => {
        const interval = setInterval(() => {
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
                if (eventType == "initialPoint") {
                    if (lat) setInitialCoordLatitude(lat)
                    if (lon) setInitialCoordLongitude(lon)
                }
                if (eventType == "finalPoint") {
                    if (lat) setFinalCoordLatitude(lat)
                    if (lon) setFinalCoordLongitude(lon)
                }
                localStorage.removeItem("eventType")
                localStorage.removeItem("lat")
                localStorage.removeItem("lon")
            }
        }, 30);

        return () => {
            clearInterval(interval); // Limpa o intervalo ao desmontar o componente
        };
    }, []);

    return (
        <>
            <div className={css.menu}>
                <div className={css.info}>
                    <label>
                        <img src={Icons.airplaneIconUrl} alt="Start Icon" />
                        Coordenada Atual:
                        <span>{info.currentCoord.latitude.toFixed(2)}° | {info.currentCoord.longitude.toFixed(2)}°</span>
                    </label>
                </div>
                <hr />
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
            </div>
        </>
    )
}