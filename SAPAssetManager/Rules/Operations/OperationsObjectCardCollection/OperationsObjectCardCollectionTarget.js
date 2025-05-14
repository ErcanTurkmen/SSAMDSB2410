import { prepareDataForMyWorkSection } from '../../OverviewPage/MyWorkSection/MyWorkSectionQueryOption';
import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import { OperationConstants } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';
import OperationsEntitySet from '../../WorkOrders/Operations/OperationsEntitySet';
import { IsBindingObjectOnline } from '../../WorkOrders/IsBindingObjectOnline';


export default function OperationsObjectCardCollectionTarget(context) {
    return (IsOperationLevelAssigmentType(context) ? prepareDataForMyWorkSection(context) : Promise.resolve())
        .then(() => {
            if (IsBindingObjectOnline(context)) {
                return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', OperationsEntitySet(context), [], '$expand=Header');
            }
            return context.read('/SAPAssetManager/Services/AssetManager.service', OperationsEntitySet(context), [], OperationConstants.OperationsObjectCardCollectionQueryOptions(context, 50));
        });
}
