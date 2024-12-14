import CoordinateClass from "../models/CoordinateClass";

function positionBetweenRadianPoints(start: CoordinateClass, end: CoordinateClass, time: number): CoordinateClass {
    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const toDegrees = (rad: number) => (rad * 180) / Math.PI;

    const lat1 = toRadians(start.latitude);
    const lon1 = toRadians(start.longitude);
    const lat2 = toRadians(end.latitude);
    const lon2 = toRadians(end.longitude);

    const deltaSigma = Math.acos(
        Math.sin(lat1) * Math.sin(lat2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
    );

    if (deltaSigma === 0) {
        return new CoordinateClass({latitude: start.latitude, longitude: start.longitude});
    }

    const a = Math.sin((1 - time) * deltaSigma) / Math.sin(deltaSigma);
    const b = Math.sin(time * deltaSigma) / Math.sin(deltaSigma);

    const x = a * Math.cos(lat1) * Math.cos(lon1) + b * Math.cos(lat2) * Math.cos(lon2);
    const y = a * Math.cos(lat1) * Math.sin(lon1) + b * Math.cos(lat2) * Math.sin(lon2);
    const z = a * Math.sin(lat1) + b * Math.sin(lat2);

    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);

    return new CoordinateClass({latitude: toDegrees(lat), longitude: toDegrees(lon)});
}

export default positionBetweenRadianPoints;