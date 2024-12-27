import BackendConnection from "../connection/BackendConnection"
import saoPaulogeographicCenter from "../constants/saoPauloGeographicCenter"
import CoordinateClass from "../models/CoordinateClass"
import LocalityType from "../types/LocalityType"

export default function Test() {
    const coord: CoordinateClass = new CoordinateClass(saoPaulogeographicCenter)
    
    async function testar() {
        const response: LocalityType | undefined = await BackendConnection.getLocation(coord)
        if (!response) {
            console.log("Failed to connect")
        } else {
            console.log(response)
        }
    }
    
    return (
        <>
            <h1>teste</h1>
            <button onClick={testar}>testar</button>
        </>
    )
}