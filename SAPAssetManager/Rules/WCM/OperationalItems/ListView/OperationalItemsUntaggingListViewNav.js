import libCommon from '../../../Common/Library/CommonLibrary';
import OperationalItemsListViewNav from './OperationalItemsListViewNav';

export default function OperationalItemsUntaggingListViewNav(context) {
    libCommon.setStateVariable(context, 'operationalItemsListPreselectedTabIndex', 2);
    return OperationalItemsListViewNav(context);
}
