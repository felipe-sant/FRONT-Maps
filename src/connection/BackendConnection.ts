import BrazilianStates from "../enum/brazilianStates";
import get from "../functions/get";
import CoordinateClass from "../models/CoordinateClass";
import CoordinateType from "../types/CoordinateType";
import LocalityType from "../types/LocalityType";

class BackendConnection {
    private static readonly backend_url = "http://localhost:3001/";
    public static readonly routes = {
        coord: BackendConnection.backend_url + "coord/",
        coord_location: BackendConnection.backend_url + "coord/location/",
        coord_random: BackendConnection.backend_url + "coord/randomCoord/",
    }

    public static async getLocation(coord: CoordinateClass): Promise<LocalityType | undefined> {
        try {
            const query = {
                lat: coord.latitude,
                lon: coord.longitude
            }
            const response = await get(BackendConnection.routes.coord_location, query)
            const locality: LocalityType = {
                country: response.country,
                state: response.state,
                city: response.city,
                district: response.district,
                street: response.street,
                postalCode: response.postalCode
            }
            return locality
        } catch (error) {
            console.log(error)
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