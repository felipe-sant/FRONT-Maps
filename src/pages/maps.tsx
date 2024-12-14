import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import css from "../styles/maps.module.css";
import 'leaflet/dist/leaflet.css';
import CoordinateClass from "../models/CoordinateClass";
import BackendConnection from "../connection/BackendConnection";

export default function Maps() {
    async function teste(coord: CoordinateClass) {
        const response = await BackendConnection.getLocation(coord);
        console.log(response);
    }

    function LocationClicked() {
        useMapEvents({
            click: (event) => {
                const { lat, lng } = event.latlng;
                const coordinates = new CoordinateClass({latitude: lat, longitude: lng});
                teste(coordinates);
            },
        });

        return null
    }

    return (
        <main>
            <MapContainer   
                center={[0, 0]}
                zoom={3}
                className={css.map}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    errorTileUrl="https://upload.wikimedia.org/wikipedia/commons/e/e0/Error.svg"
                />
                <LocationClicked />
            </MapContainer>
        </main>
    )
}