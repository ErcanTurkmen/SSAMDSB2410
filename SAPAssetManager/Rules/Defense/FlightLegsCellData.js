import libCom from '../Common/Library/CommonLibrary';

/**
 * Return an array of flight leg cells for the timeline control to consume
 * @param {*} context 
 * @returns 
 */
export default function FlightLegsCellData(context) {
    let rows = context.binding;
    let cells = [];

    if (rows.length > 0) {
        cells.push({ //Add start row
            'Headline': context.localizeText('start'),
            'State': 'Start',
        });

        rows.forEach(row => { //Add each flight leg consisting of a takeoff and landing row
            cells.push({
                Headline: context.localizeText('leg_take_off'),
                Timestamp: formatDateTimeForTimeline(row.TakeoffDate, row.TakeoffTime),
                State: 'Open',
            });

            cells.push({
                Headline: context.localizeText('leg_landing_destination', [row.Destination]),
                Subhead: row.Comment,
                Attribute: context.localizeText('leg_flight_time',[row.FlightTime.trimEnd(), row.FlightTimeUnit]),
                Timestamp: formatDateTimeForTimeline(row.LandingDate, row.LandingTime),
                State: 'Open',
            });
        });

        cells.push({ //Add complete row
            'Headline': context.localizeText('complete'),
            'State': 'End',
        });
    }
    //Set a state variable to indicate we are returning from the flight legs and do not need to refresh WO details screen
    libCom.setStateVariable(context, 'ReturningFromFlightData', true);
    return cells;
}

/**
 * Handle the flight date/time formatting for a timeline control
 * Timestamp should be returned in ISO format to display correctly
 * Timeline control auto-converts back to local time
 * @param {*} context 
 * @param {*} date 
 * @param {*} time 
 * @returns 
 */
export function formatDateTimeForTimeline(date, time) {
    try {
        if (date && time) {
            return new Date(date.substring(0, 10) + 'T' + time).toISOString();
        } else {
            return '';
        }
    } catch (err) {
        return '';
    }
}
