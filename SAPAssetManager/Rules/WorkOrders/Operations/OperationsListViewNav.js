import libCom from '../../Common/Library/CommonLibrary';
import OperationsListViewWithResetFiltersNav from './OperationsListViewWithResetFiltersNav';

export default function OperationsListViewNav(context) {

    libCom.setStateVariable(context,'FromOperationsList', true);
    return OperationsListViewWithResetFiltersNav(context);
}
