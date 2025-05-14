import DeepLinkLibrary from './DeepLinkLibrary';

export default class DeepLinkConfig {
    static getActionsConfig() {
        return {
            'create': {
                'idRequired': false,
            }, 
            'view': {
                'idRequired': false,
            }, 
            'update': {
                'idRequired': true,
            }, 
            'delete': {
                'idRequired': true,
            }, 
        };
    }

    static getEntityConfig() {
        return {
            'MyWorkOrderHeaders': {
                'viewAction': DeepLinkLibrary.ViewWorkOrderNav,
                'createAction': DeepLinkLibrary.CreateWorkOrderNav,
                'isCreateActionAllowed': DeepLinkLibrary.CreateWorkOrderAllowed,
                'setObjectVariables': DeepLinkLibrary.SetWorkOrderVariables,
                'isViewActionAllowed': DeepLinkLibrary.ViewActionAllowed,
                'getViewQueryOptions': DeepLinkLibrary.SetWorkOrderQueryOptions,
                'updateAction': DeepLinkLibrary.UpdateWorkOrderNav,
                'isUpdateActionAllowed': DeepLinkLibrary.UpdateWorkOrderAllowed,
            },
            'MyWorkOrderOperations': {
                'createAction': DeepLinkLibrary.CreateOperationNav,
                'isCreateActionAllowed': DeepLinkLibrary.CreateOperationAllowed,
                'setObjectVariables': DeepLinkLibrary.SetOperationVariables,
                'viewAction': DeepLinkLibrary.ViewOperationNav,
                'isViewActionAllowed': DeepLinkLibrary.ViewActionAllowed,
                'getViewQueryOptions': DeepLinkLibrary.SetOperationQueryOptions,
                'updateAction': DeepLinkLibrary.UpdateOperationNav,
                'isUpdateActionAllowed': DeepLinkLibrary.UpdateWorkOrderAllowed,
            },
            'MyWorkOrderSubOperations': {
                'createAction': DeepLinkLibrary.CreateSubOperatationNav,
                'isCreateActionAllowed': DeepLinkLibrary.CreateSubOperationAllowed,
                'setObjectVariables': DeepLinkLibrary.SetSubOperationVariables,
                'viewAction': DeepLinkLibrary.ViewSubOperationNav,
                'isViewActionAllowed': DeepLinkLibrary.ViewActionAllowed,
                'getViewQueryOptions': DeepLinkLibrary.SetSubOperationsQueryOptions,
                'updateAction': DeepLinkLibrary.UpdateSubOperationNav,
                'isUpdateActionAllowed': DeepLinkLibrary.UpdateWorkOrderAllowed,
            },
            'MyNotificationHeaders': {
                'createAction': DeepLinkLibrary.CreateNotificationNav,
                'isCreateActionAllowed': DeepLinkLibrary.CreateNotificationAllowed,
                'viewAction': DeepLinkLibrary.ViewNotificationNav,
                'isViewActionAllowed': DeepLinkLibrary.ViewActionAllowed,
                'updateAction': DeepLinkLibrary.UpdateNotificationNav,
                'isUpdateActionAllowed': DeepLinkLibrary.UpdateNotificationAllowed,
                'getViewQueryOptions': DeepLinkLibrary.SetNotificationQueryOptions,
            },
            'CatsTimesheets': {
                'createAction': DeepLinkLibrary.CreateTimeSheetNav,
                'isCreateActionAllowed': DeepLinkLibrary.CreateTimesheetAllowed,
                'setObjectVariables': DeepLinkLibrary.SetTimesheetVariables,
                'updateAction': DeepLinkLibrary.UpdateCatsTimesheetNav,
                'isUpdateActionAllowed': DeepLinkLibrary.CreateTimesheetAllowed,
            },
            'Confirmations': {
                'createAction': DeepLinkLibrary.CreateConfirmationNav,
                'isCreateActionAllowed': DeepLinkLibrary.CreateConfirmationAllowed,
                'updateAction': DeepLinkLibrary.UpdateConfirmationNav,
                'isUpdateActionAllowed': DeepLinkLibrary.CreateConfirmationAllowed,
            },
            'MyWorkOrderComponents': {
                'createAction': DeepLinkLibrary.CreatePartNav,
                'isCreateActionAllowed': DeepLinkLibrary.CreateSubOperationAllowed,
                'updateAction': DeepLinkLibrary.UpdatePartNav,
                'isUpdateActionAllowed': DeepLinkLibrary.UpdatePartAllowed,
            },
            'MaterialDocuments': {
                'createAction': DeepLinkLibrary.CreateIssuePartNav,
                'isCreateActionAllowed': DeepLinkLibrary.CreateIssuePartAllowed,
            },
            'MyFunctionalLocations': {
                'viewAction': DeepLinkLibrary.ViewFunctionalLocationNav,
                'isViewActionAllowed': DeepLinkLibrary.ViewActionAllowed,
            },
            'MyEquipments': {
                'viewAction': DeepLinkLibrary.ViewEquipmentNav,
                'isViewActionAllowed': DeepLinkLibrary.ViewActionAllowed,
                'getViewQueryOptions': DeepLinkLibrary.SetEquipmentQueryOptions,
            },
        };
    }
}
