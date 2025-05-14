import libCom from '../../Common/Library/CommonLibrary';

export default function ShowMaterialTransferToFields(context) {
    let type = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');
     
    return (type === 'TRF' || (type === 'ADHOC' && move === 'T'));
}
