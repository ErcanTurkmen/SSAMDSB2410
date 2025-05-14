import libCom from '../../Common/Library/CommonLibrary';

export default function StatusWorkPermitPrintedText(context) {
    return libCom.getEntityProperty(context, `SystemStatuses('${context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/WorkPermitPrinted.global').getValue()}')`, 'StatusText');
}
