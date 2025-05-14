import libCom from '../../Common/Library/CommonLibrary';
export default async function BaseQuantityUOMValue(context) {
    const target = libCom.getStateVariable(context, 'SerialPageBinding');
    return target.UOM;
}
