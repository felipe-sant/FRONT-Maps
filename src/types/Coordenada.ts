class Coordenada {
    latitude: number
    longitude: number
    constructor(latitude: number, longitude: number) {
        this.latitude = latitude
        this.longitude = longitude
    }
    toJson(): [number, number] {
        return [this.latitude, this.longitude]
    }
}
export default Coordenada