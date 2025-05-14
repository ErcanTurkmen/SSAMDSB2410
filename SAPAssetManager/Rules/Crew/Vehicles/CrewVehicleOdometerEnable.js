import point from './CrewVehicleOdometerPoint';

export default function CrewVehicleOdometerEnable(context) {
    return !!point(context);
}
