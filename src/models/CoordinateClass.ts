import CoordinateType from "../types/CoordinateType";

class CoordinateClass {
    public latitude: number;
    public longitude: number;

    constructor(coordinateType: CoordinateType) {
        this.latitude = coordinateType.latitude;
        this.longitude = coordinateType.longitude;
    }

    public toArray(): number[] {
        return [this.latitude, this.longitude];
    }
}

export default CoordinateClass;