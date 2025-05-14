import CommonLibrary from '../../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../../../ServiceOrders/S4ServiceLibrary';
import { OnUpdateServiceQuotationItem } from './OnCreateServiceQuotationItem';

export default function ServiceQuotationItemOnCommit(context) {
    if (CommonLibrary.IsOnCreate(context)) {
        if (S4ServiceLibrary.isOnSQChangeset(context)) {
            return context.executeAction('/SAPAssetManager/Actions/ServiceQuotations/CreateUpdate/ServiceQuotationCreateChangeSet.action');
        } else {
            return context.executeAction('/SAPAssetManager/Actions/ServiceQuotations/Items/ServiceQuotationItemCreateChangeSet.action');
        }
    }

    return OnUpdateServiceQuotationItem(context);
}
