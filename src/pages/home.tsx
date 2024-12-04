import { useEffect, useState } from "react"
import Localidade from "../types/Localidade"
import Coordenada from "../types/Coordenada"
import css from "../styles/home.module.css"
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import customIcon from "../const/customIcon"
import BackendConnection from "../data/BackendConnection"
import 'leaflet/dist/leaflet.css';
import distanciaEntreCoordenadas from "../calc/distanciaEntreCoordeanadas";

function Home() {
    const [coordenadaInicial, setCoordenadaInicial] = useState(new Coordenada(-10.3333, -51.9253)); // São Paulo
    const [coordenadaAtual, setCoordenadaAtual] = useState(new Coordenada(-10.3333, -51.9253)); // São Paulo
    const [coordenadaFinal, setCoordenadaFinal] = useState(new Coordenada(-10.3333, -51.9253)); // Nova York
    const [localidade, setLocalidade] = useState<Localidade | null>(null)

    async function buscarLocalização() {
        const loc = await BackendConnection.getLocation(coordenadaAtual)
        setLocalidade(loc)
    }

    async function iniciarCoordenada() {
        let coordenadaAleatoria1 = await BackendConnection.getRandomCoord()
        setCoordenadaInicial(coordenadaAleatoria1)
        setCoordenadaAtual(coordenadaAleatoria1)
        let coordenadaAleatoria2 = await BackendConnection.getRandomCoord()
        while (distanciaEntreCoordenadas(coordenadaAleatoria1, coordenadaAleatoria2) < 1000) {
            coordenadaAleatoria2 = await BackendConnection.getRandomCoord()
            console.log("Coordenada inicial e atual muito próximas, buscando outra coordenada...")
        }
        setCoordenadaFinal(coordenadaAleatoria2)
    }

    useEffect(() => {
        iniciarCoordenada()
    }, [])

    function testar() {
        console.log("Testando...")
        console.log("Coordenada inicial:", coordenadaInicial)
        console.log("Coordenada atual:", coordenadaAtual)
        console.log("Coordenada final:", coordenadaFinal)
        console.log("Distancia entre cordenadas:", distanciaEntreCoordenadas(coordenadaInicial, coordenadaFinal))
    }

    return (
        <main className={css.main}>
            <MapContainer
                center={coordenadaAtual.toJson()}
                className={css.map}
                zoom={4}
                scrollWheelZoom={true} // Desativa o zoom ao rolar o mouse
                dragging={true} // Desativa a capacidade de arrastar o mapa
                doubleClickZoom={true} // Desativa o zoom ao clicar duas vezes
                zoomControl={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    errorTileUrl="https://upload.wikimedia.org/wikipedia/commons/e/e0/Error.svg" // Tile de erro
                />
                <Marker position={coordenadaAtual.toJson()} icon={customIcon} />
                <Marker position={coordenadaFinal.toJson()} icon={customIcon} />
                <button className={css.button} onClick={testar}>Testar</button>
            </MapContainer>
        </main>
    )
}

export default Home