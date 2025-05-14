import libVal from '../Common/Library/ValidationLibrary';

export default function QMNotificationDefectType(context, bindingObject) {

    if (libVal.evalIsEmpty(bindingObject)) {
        bindingObject = context.binding;
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(OrderType='${bindingObject.InspectionLot_Nav.WOHeader_Nav.OrderType}', PlanningPlant='${bindingObject.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}')`, [], '').then(result => {
        if (result && result.length > 0) {
            return result.getItem(0).QMNotifType;
        } else {
            return 'QM';
        }
    });
}
