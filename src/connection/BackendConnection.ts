import BrazilianStates from "../enum/brazilianStates";
import get from "../functions/methods/get";
import CoordinateClass from "../models/CoordinateClass";
import Locality from "../types/LocalityType";

class BackendConnection {
    private static readonly backend_url = "http://localhost:3001/";
    public static readonly routes = {
        coord: BackendConnection.backend_url + "coord/",
        coord_location: BackendConnection.backend_url + "coord/location/",
        coord_random: BackendConnection.backend_url + "coord/randomCoord/",
    }

    public static async getLocation(coord: CoordinateClass): Promise<Locality | undefined> {
        try {
            const query = {
                lat: coord.latitude,
                lon: coord.longitude
            }
            console.log(BackendConnection.routes.coord_location)
            const response = await get(BackendConnection.routes.coord_location, query)
            if (!response) return undefined
            
            const locality: Locality = {
                country: response.country,
                state: response.state,
                municipality: response.municipality,
                microregion: response.microregion,
                mesoregion: response.mesoregion
            }
            return locality
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    public static async getRandomCoord(state?: BrazilianStates): Promise<CoordinateClass | undefined> {
        try {
            const query = {state: state}
            const response = await get(BackendConnection.routes.coord_random, query)
            const coord = new CoordinateClass(response)
            return coord
        } catch (error) {
            console.log(error)
        }
    }
}

export default BackendConnection;