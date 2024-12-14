import BackendConnection from "../connection/BackendConnection";
import BrazilianStates from "../enum/brazilianStates";
import CoordinateClass from "../models/CoordinateClass";

export default function Maps() {
    async function teste() {
        const state: BrazilianStates = BrazilianStates.SP
        const coord = new CoordinateClass({latitude: -10, longitude: -67})
        const locality = await BackendConnection.getLocation(coord)
        console.log(locality)
    }

    return (
        <main>
            <h1>Maps</h1>
            <button onClick={teste}>penis</button>
        </main>
    )
}