import libCommon from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';

export default function OperationalItemsListViewOnLoaded(context) {
    const preselectedTabIndex = libCommon.getStateVariable(context, 'operationalItemsListPreselectedTabIndex');
    if (!libVal.evalIsEmpty(preselectedTabIndex)) {
        const tabControl = context.getPageProxy().getControls().find(i => i.getType() === 'Control.Type.Tabs');
        tabControl.setSelectedTabItemByIndex(preselectedTabIndex);

        libCommon.removeStateVariable(context, 'operationalItemsListPreselectedTabIndex');
    }
}
