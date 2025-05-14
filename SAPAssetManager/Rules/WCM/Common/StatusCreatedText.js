import libCom from '../../Common/Library/CommonLibrary';

export default function StatusCreatedText(context) {
    return libCom.getEntityProperty(context, `SystemStatuses('${context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Created.global').getValue()}')`, 'StatusText');
}
