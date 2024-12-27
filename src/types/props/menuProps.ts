import CoordinateClass from "../../models/CoordinateClass"

type MenuProps = {
    moveOn: (initialCoord: CoordinateClass, finalCoord: CoordinateClass, updateCoord: (coord: CoordinateClass) => Promise<void>) => void
    info: {
        currentCoord: CoordinateClass
    }
}

export default MenuProps