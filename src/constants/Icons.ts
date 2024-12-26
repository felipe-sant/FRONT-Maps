import L from 'leaflet';
import startIcon from '../images/start.png';
import endIcon from "../images/end.png";
import airplaneIcon from "../images/airplane.png"

class Icons {
    static startIcon = new L.Icon({
        iconUrl: startIcon,
        iconRetinaUrl: startIcon,
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 42],
        iconAnchor: [12, 42]
    })

    static startIconUrl = startIcon

    static endIcon = new L.Icon({
        iconUrl: endIcon,
        iconRetinaUrl: endIcon,
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    })

    static endIconUrl = endIcon

    static airplaneIcon = new L.Icon({
        iconUrl: airplaneIcon,
        iconRetinaUrl: airplaneIcon,
        iconSize: [24, 24],
    })

    static airplaneIconUrl = airplaneIcon
}

export default Icons;