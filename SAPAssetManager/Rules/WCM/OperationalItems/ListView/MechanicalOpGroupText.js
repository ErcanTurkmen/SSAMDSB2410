import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default async function MechanicalOpGroupText(context) {
    const mechanicalOpGroupText = await CommonLibrary.getEntityProperty(context, `WCMOpGroups('${context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/OperationalGroups/Mechanical.global').getValue()}')`, 'TextOpGroup');
    return mechanicalOpGroupText || '/SAPAssetManager/Globals/WCM/OperationalGroups/Mechanical.global';
}
