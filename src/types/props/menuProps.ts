import CoordinateClass from "../../models/CoordinateClass"

type MenuProps = {
    moveOn: (initialCoord: CoordinateClass, finalCoord: CoordinateClass) => void
    info: {
        currentCoord: CoordinateClass
    }
}

export default MenuProps