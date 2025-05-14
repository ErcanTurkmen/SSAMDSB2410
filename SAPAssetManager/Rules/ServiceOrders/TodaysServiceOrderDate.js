/**
* Get default date for Service Order. Has different behaviour on Demo component!
*/
export default function TodaysServiceOrderDate() {
    let date = (new Date(new Date().setHours(0, 0, 0, 0))).toISOString();
    return date;
}

