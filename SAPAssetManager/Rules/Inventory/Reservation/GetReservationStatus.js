import Reservation from './Reservation';

/** function to fetch the current status of reservation */
export default function GetReservationStatus(clientAPI) {
    const reservation = new Reservation(clientAPI, clientAPI.binding);
    return reservation.getStatus();
}
