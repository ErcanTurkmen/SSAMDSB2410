import CommonLibrary from '../../Common/Library/CommonLibrary';
import QueryBuilder from '../../Common/Query/QueryBuilder';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function ParentItemPickerQueryOptions(context, selectedObjectId) {
    const queryBuilder = new QueryBuilder();

    if (S4ServiceLibrary.isOnSOChangeset(context)) {
        queryBuilder.addFilter('false');
        return queryBuilder.build();
    }

    const objectID = selectedObjectId || context.binding?.ObjectID;
    if (objectID) {
        const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue()); 
        queryBuilder.addExpandStatement('MobileStatus_Nav');
        queryBuilder.addFilter(`ObjectID eq '${objectID}'`);
        queryBuilder.addFilter(`MobileStatus_Nav/MobileStatus ne '${COMPLETED}'`);
        if (!CommonLibrary.IsOnCreate(context) && context.binding?.ItemNo) {
            queryBuilder.addFilter(`ItemNo ne '${context.binding.ItemNo}'`);
        }
        return queryBuilder.build();
    }

    queryBuilder.addFilter('false');
    return queryBuilder.build();
}

export function updateParentItemControlQueryOptions(control) {
    const parentItemControl = CommonLibrary.getControlProxy(control.getPageProxy(), 'ParentItemLstPkr');
    const selectedObjectId = CommonLibrary.getControlValue(control);
    const parentItemTargetSpecifier = parentItemControl.getTargetSpecifier();
    const query = ParentItemPickerQueryOptions(control, selectedObjectId);
    parentItemTargetSpecifier.setQueryOptions(query);
    parentItemControl.setTargetSpecifier(parentItemTargetSpecifier);
}
