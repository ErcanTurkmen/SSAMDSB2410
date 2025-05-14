import CommonLibrary from '../../../../Common/Library/CommonLibrary';


export default function PRTCreateUpdateOnCommit(context) {
    const action = CommonLibrary.IsOnCreate(context) ?
        '/SAPAssetManager/Actions/WorkOrders/Operations/PRT/CreateUpdate/PRTEquipmentCreate.action' :
        '/SAPAssetManager/Actions/WorkOrders/Operations/PRT/CreateUpdate/PRTEquipmentUpdate.action';

    return context.executeAction(action)
        .then(() => CommonLibrary.setOnCreateUpdateFlag(context, ''));
}
