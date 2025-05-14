import MeterSectionLibrary from '../../Meter/Common/MeterSectionLibrary';

/**
* Getting i18n value based on order type
* @param {IClientAPI} clientAPI
*/
export default function MetersKPILabelForPoints(clientAPI) {
    return MeterSectionLibrary.kpiHeaderTargetValues(clientAPI, 'Label', clientAPI.getPageProxy()?.binding);
}
