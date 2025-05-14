import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

/**
 * Modify page metatdata
 * 
 * @param {IClientAPI} clientAPI 
 * @returns page modifications
 */
export default async function WarehouseTaskDetailsPageMetadata(clientAPI) {
    const page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/EWM/WarehouseTasks/WarehouseTaskDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'WarehouseTaskDetails0');
}
