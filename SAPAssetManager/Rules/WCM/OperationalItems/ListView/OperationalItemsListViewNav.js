import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { NavToRelatedOperationalItemsListPage } from './CertificateRelatedOperationalItemsListViewNav';

export default function OperationalItemsListViewNav(context) {
    const pageName = 'OperationalItemsListViewPage';
    CommonLibrary.setStateVariable(context, 'OperationalItemsListPageName', pageName);
    return NavToRelatedOperationalItemsListPage(context, pageName);
}
