import libCommon from '../../Common/Library/CommonLibrary';
import IsEditTechObjectFeatureEnabled from '../../UserFeatures/IsEditTechObjectFeatureEnabled';

export default function FunctionalLocationUpdateNav(context) {
    if (libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']) || IsEditTechObjectFeatureEnabled(context)) {
        libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
        return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/CreateUpdate/FunctionalLocationCreateUpdateNav.action');
    }

    return context.executeAction('/SAPAssetManager/Actions/Equipment/DocumentAddEditNav.action');
}
