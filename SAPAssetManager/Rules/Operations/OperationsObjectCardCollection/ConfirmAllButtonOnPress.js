import OperationsEntitySet from '../../WorkOrders/Operations/OperationsEntitySet';
import { OperationConstants } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import WorkOrderOperationsConfirmNav from '../../WorkOrders/Operations/WorkOrderOperationsConfirmNav';

export default async function ConfirmAllButtonOnPress(context) {
    const filterPlus = libCommon.isAppParameterEnabled(context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects') ? '' : " and not substringof('L', OperationNo)"; //Exclude locals if parameter restricts them
    const queryOptions = libCommon.attachFilterToQueryOptionsString(OperationConstants.OperationsObjectCardCollectionQueryOptions(context), OperationConstants.notFinallyConfirmedFilter() + filterPlus);
    const operationsToConfirm = await context.read('/SAPAssetManager/Services/AssetManager.service', OperationsEntitySet(context, context.getPageProxy().binding), [], queryOptions);
    libCommon.setStateVariable(context, 'selectedOperations', operationsToConfirm.map(operation => ({binding: operation})));

    return WorkOrderOperationsConfirmNav(context);
}
