import libCommon from '../../Common/Library/CommonLibrary';

export default function OperationDetailsEquipmentEntitySets(context) {
    //Default to operation first if equipment or FLOCs exist, then notification

    if (context.binding.OperationEquipment || context.binding.OperationFunctionLocation) {
        return context.binding['@odata.readLink'] + '/EquipmentOperation';
    } else if (libCommon.isDefined(context.binding.NotifNum)) {
        return `MyNotificationHeaders('${context.binding.NotifNum}')/Equipment`;
    }
    return context.binding['@odata.readLink'] + '/EquipmentOperation';
}
