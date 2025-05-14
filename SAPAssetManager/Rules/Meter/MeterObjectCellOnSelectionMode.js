import MeterObjectCell from './Format/MeterObjectCell';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default async function MeterObjectCellOnSelectionMode(clientAPI) {
    if (clientAPI.getPageProxy().getControl('SectionedTable')?.getSections()[0].getSelectionMode() !== 'Multiple') {
        return await MeterObjectCell(clientAPI);
    }
    return '';
}
