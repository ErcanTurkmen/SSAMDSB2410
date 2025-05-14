import libCommon from '../Library/CommonLibrary';
import documentCreate from '../../Documents/Create/DocumentCreateBDS';
import resetFlags from './ResetFlags';
import Logger from '../../Log/Logger';
import libVal from '../../Common/Library/ValidationLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import CreateEntitySuccessMessageNoClosePageWithAutoSave from '../../ApplicationEvents/AutoSync/actions/CreateEntitySuccessMessageNoClosePageWithAutoSave';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import libS4 from '../../ServiceOrders/S4ServiceLibrary';
import WorkOrderCreateUpdateGeometryPre from '../../WorkOrders/CreateUpdate/WorkOrderCreateUpdateGeometryPre';

/**
 * After changeset success, reset the state variables
 */
export default function ChangeSetOnSuccess(pageProxy) {
    executePageActionBasedOnId(pageProxy);
    let geometryObjectType = libCommon.getStateVariable(pageProxy, 'GeometryObjectType');

    if (hasAttachments(pageProxy)) {
        return documentsCreateOnChangeSetSuccess(pageProxy).then(() => {
            resetFlags(pageProxy);
            libCommon.setStateVariable(pageProxy, 'ObjectCreatedName', 'Document');

            return handleGeometryObject(pageProxy, geometryObjectType, false);
        }).catch((error) => {
            resetFlags(pageProxy);
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), error);
        });
    } else {
        resetFlags(pageProxy);
        const isMapPage = libCommon.getCurrentPageName(pageProxy) === 'SideMenuMapExtensionControlPage';
        if (!libVal.evalIsEmpty(libCommon.getStateVariable(pageProxy, 'PartAdd'))) {
            libCommon.removeStateVariable(pageProxy, 'PartAdd', false);
            if (isMapPage) {
                return handleGeometryObject(pageProxy, geometryObjectType, true);
            }
            return ExecuteActionWithAutoSync(pageProxy, '/SAPAssetManager/Actions/Toast/ToastMessageCreate.action');
        } else if (!libVal.evalIsEmpty(libCommon.getStateVariable(pageProxy, 'BOMPartAdd'))) {
            libCommon.removeStateVariable(pageProxy, 'BOMPartAdd', false);
            if (isMapPage) {
                return handleGeometryObject(pageProxy, geometryObjectType, true);
            }
            return ExecuteActionWithAutoSync(pageProxy, '/SAPAssetManager/Actions/Toast/ToastMessageCreate.action');
        }
        return handleGeometryObject(pageProxy, geometryObjectType, true);
    }
}

function hasAttachments(pageProxy) {
    return (libCommon.getStateVariable(pageProxy, 'attachmentCount') > 0) ||
        (libCommon.getStateVariable(pageProxy, 'attachmentCountOperation') > 0) ||
        (libCommon.getStateVariable(pageProxy, 'attachmentCountItem') > 0);
}

function handleGeometryObject(pageProxy, geometryObjectType, noAttachments) {

    switch (geometryObjectType) {
        case 'Notification':
            libCommon.setStateVariable(pageProxy, 'GeometryObjectType', '');
            pageProxy.currentPage.notifBinding = libCommon.getStateVariable(pageProxy, 'CreateNotification');
            return pageProxy.getDefinitionValue('/SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateGeometryPre.js');
        case 'WorkOrder':
            libCommon.setStateVariable(pageProxy, 'GeometryObjectType', '');
            pageProxy.currentPage.woBinding = libCommon.getStateVariable(pageProxy, 'CreateWorkOrder');
            return WorkOrderCreateUpdateGeometryPre(pageProxy, true);
        case 'FunctionalLocation':
            libCommon.setStateVariable(pageProxy, 'GeometryObjectType', '');
            pageProxy.currentPage.funcLocBinding = libCommon.getStateVariable(pageProxy, 'CreateFunctionalLocation');
            return pageProxy.getDefinitionValue('/SAPAssetManager/Rules/FunctionalLocation/CreateUpdate/FunctionalLocationCreateUpdateGeometryPre.js');
        case 'Equipment':
            libCommon.setStateVariable(pageProxy, 'GeometryObjectType', '');
            pageProxy.currentPage.equipBinding = libCommon.getStateVariable(pageProxy, 'CreateEquipment');
            return pageProxy.getDefinitionValue('/SAPAssetManager/Rules/Equipment/CreateUpdate/EquipmentCreateUpdateGeometryPre.js');
        default:
            break;
    }

    if (noAttachments) {
        if (IsCompleteAction(pageProxy)) {
            return Promise.resolve();
        }

        manageConfirmationCreationState(pageProxy);
    }

    return CreateEntitySuccessMessageNoClosePageWithAutoSave(pageProxy);
}


function manageConfirmationCreationState(pageProxy) {
    let confirmationCreation = libCommon.getStateVariable(pageProxy, 'ConfirmationCreation');
    if (libCommon.getCurrentPageName(pageProxy) === 'ConfirmationsListViewPage' || confirmationCreation) {
        libCommon.setStateVariable(pageProxy, 'ObjectCreatedName', 'Confirmation');
        libCommon.removeStateVariable(pageProxy, 'ConfirmationCreation');
    }
}

function executePageActionBasedOnId(pageProxy) {
    const pageId = libCommon.getCurrentPageName(pageProxy);

    if (pageId === 'SubOperationsListViewPage') {
        pageProxy.executeAction('/SAPAssetManager/Rules/WorkOrders/SubOperations/CreateUpdate/WorkOrderSubOperationListViewCaption.js');
    }

    if (pageId === 'WorkOrderOperationsListViewPage') {
        pageProxy.executeAction('/SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderOperationListViewSetCaption.js');
    }
}

function documentsCreateOnChangeSetSuccess(pageProxy) {
    const isOnSOChangeset = libS4.isOnSOChangeset(pageProxy);
    const isOnSRChangeset = libS4.isOnSRChangeset(pageProxy);
    const isOnSQChangeset = libS4.isOnSQChangeset(pageProxy);

    //WO doc creation
    if (libCommon.getStateVariable(pageProxy, 'attachmentCount') > 0) {
        return documentCreate(pageProxy, libCommon.getStateVariable(pageProxy, 'Doc')).then(() => {
            if (isOnSOChangeset || isOnSRChangeset || isOnSQChangeset) {
                //S4 doc creation
                if (libCommon.getStateVariable(pageProxy, 'attachmentCountItem') > 0) {
                    return operationOrItemDocumentsCreate(pageProxy, 'Item');
                }
                return Promise.resolve();
            }
            //Op doc creation
            if (libCommon.getStateVariable(pageProxy, 'attachmentCountOperation') > 0) {
                return operationOrItemDocumentsCreate(pageProxy, 'Operation');
            }
            return Promise.resolve();
        });
        //No WO Doc, Instead we have only Op/Item Doc creation
    } else if (libCommon.getStateVariable(pageProxy, 'attachmentCountOperation') > 0) {
        return operationOrItemDocumentsCreate(pageProxy, 'Operation');
    } else if (libCommon.getStateVariable(pageProxy, 'attachmentCountItem') > 0) {
        return operationOrItemDocumentsCreate(pageProxy, 'Item');
    }
    return Promise.resolve();
}

function operationOrItemDocumentsCreate(pageProxy, type) {
    libCommon.setStateVariable(pageProxy, 'DocumentCreate' + type, true);
    return documentCreate(pageProxy, libCommon.getStateVariable(pageProxy, 'Doc' + type)).then(() => {
        libCommon.removeStateVariable(pageProxy, 'DocumentCreate' + type);
    }).catch(error => {
        Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), error);
        libCommon.removeStateVariable(pageProxy, 'DocumentCreate' + type);
    });
}
