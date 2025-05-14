import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetReleasedStatusCode from '../../ServiceOrders/GetReleasedStatusCode';

export default function ServiceOrdersListPickerQueryOptions(context) {
    const COMPLETE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const releasedStatusCode = GetReleasedStatusCode(context);
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceConfirmations', [], `$expand=TransHistories_Nav/S4ServiceOrder_Nav&$filter=sap.islocal() and MobileStatus_Nav/MobileStatus ne '${COMPLETE}' and sap.entityexists(TransHistories_Nav/S4ServiceOrder_Nav)`).then(result => {
        let query = `$expand=MobileStatus_Nav,TransHistories_Nav/S4ServiceConfirms_Nav,S4ServiceErrorMessage_Nav&$filter=substringof('${releasedStatusCode}',MobileStatus_Nav/SystemStatusCode) and MobileStatus_Nav/MobileStatus ne '${COMPLETE}' and not sap.entityexists(TransHistories_Nav/S4ServiceConfirms_Nav) and not sap.entityexists(S4ServiceErrorMessage_Nav)`;

        if (result.length) {
            let filters = [];
            for (let i = 0; i < result.length; i++) {
                for (let history of result.getItem(i).TransHistories_Nav) { 
                    filters.push(`ObjectID ne '${history.S4ServiceOrder_Nav.ObjectID}'`);
                }
            }

            if (filters.length) {
                query += 'and ' + filters.join(' and ');
            }
        }

        return query;
    });
}
