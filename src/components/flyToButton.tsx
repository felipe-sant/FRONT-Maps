import { useMap } from "react-leaflet";

export default function FlyToButton(props: { position: [number, number] }) {
    const map = useMap()

    function handleClick() {
        map.flyTo(props.position, 4, {
            duration: 4
        })
    }

    return (
        <button
            style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                zIndex: 1000,
                background: 'white',
                border: '1px solid #ccc',
                padding: '5px 10px',
                cursor: 'pointer',
            }}
            onClick={handleClick}
        >Voar para</button>
    )
}