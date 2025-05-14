import WorkOrderFlightDetailsVisible from './WorkOrderFlightDetailsVisible';
import WorkOrderFlightDetailsQueryOptions from './WorkOrderFlightDetailsQueryOptions';
import ODataDate from '../Common/Date/ODataDate';

/**
 * If the work order has defense flight data, dynamically add the fields to the main details section 
 * @param {*} context 
 * @param {*} page 
 * @param {*} sectionName 
 * @returns 
 */
export default async function WorkOrderAddDefenseFlightDetails(context, page) {
    if (await WorkOrderFlightDetailsVisible(context)) {
        let keyValueSection = getKeyValueSection(page, 'WorkOrderDetailsSection');

        let binding = context.getActionBinding() || context.binding;
        if (binding) {
            await showFlightKeyValueFieldsInSection(context, binding, keyValueSection);
        }
    }

    return page;
}

/**
 * Read the flight details for this WO and add them to the details section metadata
 * @param {*} binding 
 * @param {*} keyValueSection 
 */
async function showFlightKeyValueFieldsInSection(context, binding, keyValueSection) {
    let keyValues = [];
    let results = await context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], WorkOrderFlightDetailsQueryOptions(context));

    if (results && results.length > 0) {
        let row = results.getItem(0);
        
        keyValues.push({
            '_Name': 'FlightForceElement',
            'KeyName': '$(L,force_element)',
            'Value': formatKeyValue(row.Flight_Nav?.ForceElement_Nav?.ObjectId, row.Flight_Nav?.ForceElement_Nav?.Name),
        });
        keyValues.push({
            '_Name': 'FlightMission',
            'KeyName': '$(L,mission)',
            'Value': formatKeyValue(row.Flight_Nav?.Mission_Nav?.Mission, row.Flight_Nav?.Mission_Nav?.Description),
        });
        keyValues.push({
            '_Name': 'FlightExternalId',
            'KeyName': '$(L,external_id)',
            'Value': formatKeyValue(row.Flight_Nav?.ExternalId),
        });
        keyValues.push({
            '_Name': 'FlightTakeoff',
            'KeyName': '$(L,takeoff_date_time)',
            'Value': formatDateTime(context, row.Flight_Nav?.TakeoffDate, row.Flight_Nav?.TakeoffTime),
        });
        keyValues.push({
            '_Name': 'FlightLanding',
            'KeyName': '$(L,landing_date_time)',
            'Value': formatDateTime(context, row.Flight_Nav?.LandingDate, row.Flight_Nav?.LandingTime),
        });
        keyValues.push({
            '_Name': 'FlightLandingSite',
            'KeyName': '$(L,landing_site)',
            'Value': formatKeyValue(row.Flight_Nav?.LandingSite),
        });
        keyValues.push({
            '_Name': 'FlightDestination',
            'KeyName': '$(L,destination)',
            'Value': formatKeyValue(row.Flight_Nav?.Destination),
        });
        keyValues.push({
            '_Name': 'FlightRunway',
            'KeyName': '$(L,runway)',
            'Value': formatKeyValue(row.Flight_Nav?.Runway),
        });
        keyValues.push({
            '_Name': 'FlightCallSign',
            'KeyName': '$(L,call_sign)',
            'Value': formatKeyValue(row.Flight_Nav?.CallSign),
        });

        keyValueSection.KeyAndValues = keyValueSection.KeyAndValues.concat(keyValues);
        return Promise.resolve();
    }
    return Promise.resolve();
}

/**
 * Find and return the details section of the WO details page metadata
 * @param {*} page 
 * @param {*} sectionName 
 * @returns 
 */
function getKeyValueSection(page, sectionName) {
    let sections = page.Controls[0].Sections;
    let keyValueSection;

    if (sectionName) {
        keyValueSection = sections.find(section => section._Name === sectionName);
    }

    return keyValueSection;
}

/**
 * Format the key/value for display
 * @param {*} key 
 * @param {*} value 
 * @returns 
 */
export function formatKeyValue(key, value) {
    if (key && value) {
        return `${key} - ${value}`;
    } else if (key) {
        return key;
    } else if (value) {
        return value;
    } else {
        return '-';
    }
}

/**
 * Handle the flight date/time formatting
 * @param {*} context 
 * @param {*} date 
 * @param {*} time 
 * @returns 
 */
function formatDateTime(context, date, time) {
    let odataDate;

    if (date && time) {
        odataDate = new ODataDate(date.substring(0, 10), time.replace(/:/g, '-'));
        return context.formatDatetime(odataDate.date());
    } else if (date) {
        odataDate = new ODataDate(date.substring(0, 10));
        return context.formatDate(odataDate.date());
    } else {
        return '-';
    }
}
