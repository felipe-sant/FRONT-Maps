import { useEffect, useState } from "react"
import Localidade from "../types/Localidade"
import Coordenada from "../types/Coordenada"
import css from "../styles/home.module.css"
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import BackendConnection from "../data/BackendConnection"
import 'leaflet/dist/leaflet.css';
import distanciaEntreCoordenadas from "../calc/distanciaEntreCoordeanadas";
import Icons from "../const/customIcon";
import moverPonto from "../calc/moverPonto";

function Home() {
    const [coordenadaInicial, setCoordenadaInicial] = useState(new Coordenada(-10.3333, -51.9253));
    const [coordenadaAtual, setCoordenadaAtual] = useState(new Coordenada(-10.3333, -51.9253));
    const [coordenadaFinal, setCoordenadaFinal] = useState(new Coordenada(-10.3333, -51.9253));
    const [localidade, setLocalidade] = useState<Localidade | null>(null)

    async function processoAviao() {
        // INICIAR COORDENADAS ALEATORIAS
        let iniciado: boolean = false
        if (iniciado) return
        iniciado = true

        let coord1 = await BackendConnection.getRandomCoord()
        let coord2 = await BackendConnection.getRandomCoord()
        while (distanciaEntreCoordenadas(coord1, coord2) < 1000) coord2 = await BackendConnection.getRandomCoord()

        // let coord1 = new Coordenada(-23.550520, -46.633308)
        // let coord2 = new Coordenada(39, 116)

        // let coord1 = new Coordenada(-23.189609, -45.884264)
        // let coord2 = new Coordenada(-23.778889, -45.358056)

        setCoordenadaInicial(coord1)
        setCoordenadaAtual(coord1)
        setCoordenadaFinal(coord2)

        // MOVER O AVIÃO
        let t = 0
        let t2 = 0
        const interval = setInterval(async () => {
            if (t < 1) {
                t += 0.001
                const novaCoord = moverPonto(coord1, coord2, t)
                setCoordenadaAtual(novaCoord)

                // BUSCAR LOCALIDADE
                t2++
                if (t2 === 10) {
                    const loc = await BackendConnection.getLocation(novaCoord)
                    setLocalidade(loc)
                    t2 = 0
                }
            } else {
                clearInterval(interval)
            }
        }, 30)
    }

    useEffect(() => {
        processoAviao()
    }, [])

    return (
        <main className={css.main}>
            <MapContainer
                center={coordenadaAtual.toJson()}
                // center={[-23.189609, -45.884264]} // São José dos Campos
                className={css.map}
                zoom={4}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    errorTileUrl="https://upload.wikimedia.org/wikipedia/commons/e/e0/Error.svg" // Tile de erro
                />

                <Marker position={coordenadaInicial.toJson()} icon={Icons.startIcon} />
                <Marker position={coordenadaAtual.toJson()} icon={Icons.airplane} />
                <Marker position={coordenadaFinal.toJson()} icon={Icons.endIcon} />

                <Polyline
                    positions={[coordenadaInicial.toJson(), coordenadaFinal.toJson()]} // Posições da linha
                    color="red"
                    weight={1}
                    opacity={0.7}
                    smoothFactor={1}
                />

                <div className={css.info}>
                    <p>Latitude: {coordenadaAtual.latitude.toFixed(4)}</p>
                    <p>Longitude: {coordenadaAtual.longitude.toFixed(4)}</p>
                    <p>Distancia da viagem: {distanciaEntreCoordenadas(coordenadaInicial, coordenadaFinal).toFixed(1)} km</p>
                    <p>Localidade: {localidade ? <>{localidade?.pais}, {localidade?.estado}</> : <span className={css.error}>Avião fora do Brasil</span>}</p>
                </div>
            </MapContainer>
        </main>
    )
}

export default Home