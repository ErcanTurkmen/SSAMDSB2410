import libCom from '../../Common/Library/CommonLibrary';

export default function GoodsRecipientEditable(context) {
    return ['IB','OB'].every((p) => p !== (libCom.getStateVariable(context, 'IMObjectType')));
}
