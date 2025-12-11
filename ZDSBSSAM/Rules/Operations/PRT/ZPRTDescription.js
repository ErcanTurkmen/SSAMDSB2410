
export default function ZPRTDescription(context) {


    return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'Equipments', [], `$filter=EquipId eq '${context.evaluateTargetPath('#Control:EquipmentLstPkr/#SelectedValue')}'`).then(result => {
        if (result && result.getItem(0)) {
            return result.getItem(0).EquipDesc;
        }
        return '';
    });
}
