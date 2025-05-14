import libCommon from '../../../Common/Library/CommonLibrary';
import OperationalItemsListViewNav from './OperationalItemsListViewNav';

export default function OperationalItemsTaggingListViewNav(context) {
    libCommon.setStateVariable(context, 'operationalItemsListPreselectedTabIndex', 1);
    return OperationalItemsListViewNav(context);
}
