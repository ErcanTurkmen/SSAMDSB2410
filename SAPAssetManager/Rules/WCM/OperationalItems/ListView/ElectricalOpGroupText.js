import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default async function ElectricalOpGroupText(context) {
    const electricalOpGroupText = await CommonLibrary.getEntityProperty(context, `WCMOpGroups('${context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/OperationalGroups/Electrical.global').getValue()}')`, 'TextOpGroup');
    return electricalOpGroupText || '/SAPAssetManager/Globals/WCM/OperationalGroups/Electrical.global';
}
