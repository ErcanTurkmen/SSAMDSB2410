import libCommon from '../../Common/Library/CommonLibrary';
import libNotif from '../NotificationLibrary';

export default async function NotificationCreateUpdateSoldToPartyPickers(context) {
    // Determine which Partner pickers need to be displayed. This is affected by Notification Type and Technical Object
    const page = context.getPageProxy();
    const equipPickerValue = page.evaluateTargetPath('#Control:EquipHierarchyExtensionControl').getValue();
    const flocPickerValue = page.evaluateTargetPath('#Control:FuncLocHierarchyExtensionControl').getValue();
    const typeListPicker = page.evaluateTargetPathForAPI('#Control:TypeLstPkr');
    const type = libCommon.getControlValue(typeListPicker);
    const soldToPartyFunction = context.getGlobalDefinition('/SAPAssetManager/Globals/PartnerFunctions/SoldToPartyType.global').getValue();

    if (type) {
        let disableSoldToParty = false;
        if (equipPickerValue) {
            disableSoldToParty = await context.count('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${equipPickerValue}')/Partners`, [], `$filter=PartnerFunction eq '${soldToPartyFunction}'`).then(count => {
                return count > 0;
            });
        }
        if (flocPickerValue && !disableSoldToParty) {
            disableSoldToParty = await context.count('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${flocPickerValue}')/Partners`, [], `$filter=PartnerFunction eq '${soldToPartyFunction}'`).then(count => {
                return count > 0;
            });
        }
        let filters = [`NotifType eq '${type}' and PartnerIsMandatory eq 'X'`, 'sap.entityexists(PartnerFunction_Nav)'];
        if (disableSoldToParty) {
            filters.push(`PartnerFunction ne '${soldToPartyFunction}'`);
        }
        return libNotif.UpdatePartnerControls(context, filters);
    }
    return Promise.resolve();
}
