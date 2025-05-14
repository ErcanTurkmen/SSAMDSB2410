import libCom from '../../Common/Library/CommonLibrary';

export default function StatusTagPrintedText(context) {
    return libCom.getEntityProperty(context, `SystemStatuses('${context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Prepared.global').getValue()}')`, 'StatusText');
}
