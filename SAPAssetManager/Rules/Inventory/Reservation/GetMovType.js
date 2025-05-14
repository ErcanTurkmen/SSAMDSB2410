import Reservation from './Reservation';

/** function to fetch the movement type and its corresponding movement type description of reservation */
export default async function GetMovType(clientAPI) {
    const reservation = new Reservation(clientAPI, clientAPI.binding);
    let movementType = await reservation.getMovementType();
    let movementTypeDesc = await reservation.getMovementTypeDesc();
    return `${movementType} - ${movementTypeDesc}`;
}

