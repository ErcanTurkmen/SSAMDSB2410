import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function EqipmentLocalLink(context) {
    const equipId =  CommonLibrary.getStateVariable(context, 'createdEquipID');
    return `MyEquipments('${equipId}')`;
}
