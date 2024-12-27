import CoordinateClass from "../../models/CoordinateClass"

type MenuProps = {
    moveOn: (startCoord: CoordinateClass | undefined, endCoord: CoordinateClass | undefined, updateCoord: (coord: CoordinateClass) => Promise<void>) => void
    info: {
        currentCoord: CoordinateClass
    }
}

export default MenuProps