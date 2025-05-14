
/** @param {{binding: CrewListItem} & IClientAPI} context  */
export default function CrewVehicleOdometerPoint(context) {
    const mPoints = context.binding.Fleet.MeasuringPoints;
    return mPoints.find(mPoint => mPoint.CharName === 'ODOMETERREADING')?.Point;
}
