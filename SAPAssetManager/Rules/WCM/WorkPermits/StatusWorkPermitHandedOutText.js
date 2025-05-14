import libCom from '../../Common/Library/CommonLibrary';

export default function StatusWorkPermitHandedOutText(context) {
    return libCom.getEntityProperty(context, `SystemStatuses('${context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/HandedOut.global').getValue()}')`, 'StatusText');
}
