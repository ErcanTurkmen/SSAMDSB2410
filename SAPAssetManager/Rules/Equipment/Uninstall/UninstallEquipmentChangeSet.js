import libCommon from '../../Common/Library/CommonLibrary';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import appSettings from '../../Common/Library/ApplicationSettings';

// Check if any of the selected equipments were installed locally and dicard installation, for the rest ones do a regular dismantle action
export default function UninstallEquipmentChangeSet(context) {

    const equipments = context.getControl('FormCellContainer').getControl('EquipmentPicker').getValue();
    let locallyInstalledEquip;
    try {
        locallyInstalledEquip = JSON.parse(appSettings.getString(context, 'LocallyIntalledEquip'));
    } catch (err) {
        locallyInstalledEquip = [];
    }

    let equipToDiscard = [];
    let equipToDismantle = [];
    if (libCommon.isDefined((locallyInstalledEquip))) {
        // partition equipments array based on items being locally installed
        [equipToDiscard, equipToDismantle] = equipments
            .reduce(([toDiscard, toDismantle], equipment) => locallyInstalledEquip.includes(equipment.ReturnValue) ? [[...toDiscard, equipment], toDismantle] : [toDiscard, [...toDismantle, equipment]], [equipToDiscard, equipToDismantle]);
    } else {
        equipToDismantle = equipments;
    }

    return libCommon.CallActionWithPickerItems(context, '/SAPAssetManager/Actions/Equipment/Installation/EquipmentInstallationDiscardChangeSet.action', equipToDiscard)
        .then(() => libCommon.CallActionWithPickerItems(context, '/SAPAssetManager/Actions/Equipment/Uninstall/UninstallEquipmentChangeSet.action', equipToDismantle))
        .then(() => ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Equipment/Uninstall/UninstallSuccess.action'));
}
