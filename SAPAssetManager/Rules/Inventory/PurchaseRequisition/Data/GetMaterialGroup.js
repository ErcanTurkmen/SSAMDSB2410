import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetMaterialGroup(context) {
    let material = PurchaseRequisitionLibrary.getControlValue(context, 'MaterialListPicker');
    let group = '';

    if (material) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `Materials(${material})`, ['MaterialGroup'], '').then(result => {
            if (result && result.length) {
                let item = result.getItem(0);
                return item.MaterialGroup || group;
            }

            return group;
        });
    }

    return group;
}
