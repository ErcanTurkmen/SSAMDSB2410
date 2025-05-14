import HideActionItems from '../../Common/HideActionItems';
import SubOperationListViewOnLoad from './SubOperationListViewOnLoad';
import libCommon from '../../Common/Library/CommonLibrary';
import SubOperationsListViewSetCaption from './SubOperationsListViewCaption';
import FilterSettings from '../../Filter/FilterSettings';

export default function WorkOrderSubOperationListViewOnLoaded(context) {
    FilterSettings.saveInitialFilterForPage(context);
    FilterSettings.applySavedFilterOnList(context);
    SubOperationsListViewSetCaption(context).then(() => {
        let mySubOperationListView = libCommon.getStateVariable(context, 'MySubOperationListView');
        if (mySubOperationListView === true) {
            libCommon.removeStateVariable(context, 'MySubOperationListView');
        }
    });

    libCommon.setStateVariable(context, 'SUBOPERATIONS_FILTER', '');

    return SubOperationListViewOnLoad(context).then(function() {
        let completed = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        if (context.binding.SubOpMobileStatus_Nav.MobileStatus === completed) {
            HideActionItems(context, 1);
        }
    });
}
