import get from "../functions/get";
import post from "../functions/post";
import Coordenada from "../types/Coordenada";
import Localidade from "../types/Localidade";

export default class BackendConnection {
    static readonly url = "http://localhost:3001/"

    static async getLocation(coordenada: Coordenada): Promise<Localidade> {
        return await post(BackendConnection.url + "loc", coordenada)
    }

    static async getRandomCoord(): Promise<Coordenada> {
        const data = await get(BackendConnection.url + "coord") as {latitude: number, longitude: number}
        if (!data) return new Coordenada(0, 0)
        if (data.latitude === undefined || data.longitude === undefined) return new Coordenada(0, 0)
        return new Coordenada(data.latitude, data.longitude)
    }
}