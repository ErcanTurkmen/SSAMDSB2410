import libCom from '../../Common/Library/CommonLibrary';

export default function GetPhysicalInventoryDocumentItemBatchQueryOptions(context) {
    const plant = libCom.getStateVariable(context, 'PhysicalInventoryItemPlant');
    const storageLocation = libCom.getStateVariable(context, 'PhysicalInventoryItemStorageLocation');
    const material = libCom.getStateVariable(context, 'PhysicalInventoryItemMaterial');
    const qb = context.dataQueryBuilder();

    if (plant && storageLocation && material) {
        qb.filter(`MaterialNum eq '${material}' and Plant eq '${plant}' and StorageLocation eq '${storageLocation}'`);
    } else {
        qb.filter('MaterialNum eq \'-1\' and Plant eq \'-1\' and StorageLocation eq \'-1\'');
    }
    return qb;
}
