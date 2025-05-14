import libCom from '../../Common/Library/CommonLibrary';

export default function StatusClosedText(context) {
    return libCom.getEntityProperty(context, `SystemStatuses('${context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Closed.global').getValue()}')`, 'StatusText');
}
