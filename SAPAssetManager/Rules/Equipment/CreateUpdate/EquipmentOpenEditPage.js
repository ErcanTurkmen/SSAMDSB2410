import libCommon from '../../Common/Library/CommonLibrary';
import IsEditTechObjectFeatureEnabled from '../../UserFeatures/IsEditTechObjectFeatureEnabled';

export default function EquipmentOpenEditPage(context) {
    if (libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']) || IsEditTechObjectFeatureEnabled(context)) { //Allow local edits and tech object edit feature
        libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
        return context.executeAction('/SAPAssetManager/Actions/Equipment/CreateUpdate/EquipmentCreateUpdateNav.action');
    }

    return context.executeAction('/SAPAssetManager/Actions/Equipment/DocumentAddEditNav.action');
}
