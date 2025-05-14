import ValidationLibrary from '../../Common/Library/ValidationLibrary';

/**
 * Get related work orders data
 * @param {clientAPI} context MDK context
 * @param {Boolean|undefined} isStandard true if plant standard model, false if plant enhanced model, undefined if not specified 
 * @returns {Array} array of MyWorkOrderHeaders
 */
export default function GetRelatedWorkOrdersData(context, isStandard) {
    const binding = context.getPageProxy().binding;
    const entityType = binding['@odata.type'];
    if (ValidationLibrary.evalIsEmpty(isStandard) || ValidationLibrary.evalIsEmpty(entityType)) {
        return Promise.resolve([]);
    }

    const readLink = binding['@odata.readLink'];
    const orderHeaderExpand = '$expand=MyWorkOrderHeaders($expand=WODocuments,WODocuments/Document,OrderMobileStatus_Nav,OrderMobileStatus_Nav/OverallStatusCfg_Nav,WOPriority)';
    let entity;
    let query;
    
    switch (entityType) {
        case '#sap_mobile.WCMApproval':
            entity = `${readLink}/WCMApprovalOrders`;
            query = orderHeaderExpand;
            break;
        case '#sap_mobile.WCMApplication': {
                if (isStandard) {
                    entity = `${readLink}/WCMApplicationOrders`;
                    query = orderHeaderExpand;
                } else {
                    entity = `${readLink}/WCMApprovalApplications`;
                    query = `$expand=WCMApprovals($expand=WCMApprovalOrders(${orderHeaderExpand}))&$select=WCMApprovals/WCMApprovalOrders/MyWorkOrderHeaders`;
                }
            }
            break;
        case '#sap_mobile.WCMDocumentHeader': {
                entity = `${readLink}/WCMApplicationDocuments`;

                if (isStandard) {
                    query = `$expand=WCMApplications($expand=WCMApplicationOrders(${orderHeaderExpand}))&$select=WCMApplications/WCMApplicationOrders/MyWorkOrderHeaders`;
                } else {
                    query = `$expand=WCMApplications($expand=WCMApprovalApplications($expand=WCMApprovals($expand=WCMApprovalOrders(${orderHeaderExpand}))))&$select=WCMApplications/WCMApprovalApplications/WCMApprovals/WCMApprovalOrders/MyWorkOrderHeaders`;
                }
            }
            break;
        }    

    return context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], query).then((data) => {
        let result;

        switch (entityType) {
            case '#sap_mobile.WCMApproval':
                result = data;
                break;
            case '#sap_mobile.WCMApplication': {
                    if (isStandard) {
                        result = data;
                    } else {
                        result = Array.from(data, wcmApprovalApplication => wcmApprovalApplication.WCMApprovals)
                            .flatMap(wcmApproval => wcmApproval.WCMApprovalOrders);
                    }
                }
                break;
            case '#sap_mobile.WCMDocumentHeader': {
                    if (isStandard) {
                        result = Array.from(data, wcmApplicationDocument => wcmApplicationDocument.WCMApplications)
                            .flatMap(wcmApplication => wcmApplication.WCMApplicationOrders);
                    } else {
                        result = Array.from(data, wcmApplicationDocument => wcmApplicationDocument.WCMApplications)
                            .flatMap(wcmApplication => wcmApplication.WCMApprovalApplications)
                            .flatMap(wcmApprovalApplication => wcmApprovalApplication.WCMApprovals)
                            .flatMap(wcmApprovals => wcmApprovals.WCMApprovalOrders);
                    }
                }
                break;
            }

            return result.filter(item => !ValidationLibrary.evalIsEmpty(item.MyWorkOrderHeaders)).map(item => item.MyWorkOrderHeaders);

    });
}
