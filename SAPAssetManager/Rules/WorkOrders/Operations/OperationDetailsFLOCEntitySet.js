import libCommon from '../../Common/Library/CommonLibrary';

/** @param {IControlProxy & {binding: MyWorkOrderOperation}} context  */
export default function OperationDetailsFLOCEntitySet(context) {
    //Default to operation first if equipment or FLOCs exist, then notification

    if (context.binding.OperationEquipment || context.binding.OperationFunctionLocation) {
        return context.binding['@odata.readLink'] + '/FunctionalLocationOperation';
    } else if (libCommon.isDefined(context.binding.NotifNum)) {
        return `MyNotificationHeaders('${context.binding.NotifNum}')/FunctionalLocation`;
    }
    return context.binding['@odata.readLink'] + '/FunctionalLocationOperation';
}
