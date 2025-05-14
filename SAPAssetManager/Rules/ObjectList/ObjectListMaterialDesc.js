/**
 * Gets the object list material description by using the Material_Nav navlink from MyWorkOrderObjectLists entityset record.
 * Returns dash if description isn't found. 
 * @param {*} context PageProxy or SectionProxy. Its binding object should be the MyWorkOrderObjectLists entityset object.
 */
export default function ObjectListMaterialDesc(context) {
    let workOrderObjectList = context.binding;    

    if (workOrderObjectList?.Material_Nav?.Description) {
        return Promise.resolve(workOrderObjectList.Material_Nav.Description);
    }

    //Next, check if NotifHeader_Nav link exists. If so, use that to get to its equipment and then get that equipment's material info      
    if (workOrderObjectList?.NotifHeader_Nav?.Equipment?.SerialNumber?.Material?.Description) {
        return Promise.resolve(workOrderObjectList.NotifHeader_Nav.Equipment.SerialNumber.Material.Description);
    }

    //Next, check if Equipment_Nav link exists. If so, use that to get equipment's material info       
    if (workOrderObjectList?.Equipment_Nav?.SerialNumber?.Material?.Description) {
        return Promise.resolve(workOrderObjectList.Equipment_Nav.SerialNumber.Material.Description);
    }

    if (workOrderObjectList?.MaterialNum) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `Materials('${workOrderObjectList.MaterialNum}')`, ['Description', 'MaterialNum'], '')
            .then(result => {
                return result.getItem(0).Description || result.getItem(0).MaterialNum;
            })
            .catch(() => {
                return '-';
            });
    }

    return Promise.resolve('-');
}
