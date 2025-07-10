import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libMobile from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import CompleteOperationMobileStatusAction from '../../../../SAPAssetManager/Rules/Operations/MobileStatus/CompleteOperationMobileStatusAction';
import libOprMobile from './OperationMobileStatusLibrary';
import ODataDate from '../../../../SAPAssetManager/Rules/Common/Date/ODataDate';
import libAutoSync from '../../../../SAPAssetManager/Rules/ApplicationEvents/AutoSync/AutoSyncLibrary';
import ApplicationSettings from '../../../../SAPAssetManager/Rules/Common/Library/ApplicationSettings';

const workOrderOperationDetailsPage = 'WorkOrderOperationDetailsPage';
//DSB customisation
// change in confirmation to only post blank confirmation and bypass asking for time capture.
// enhanced to capture operation status to complete as it now needs to be shown on the list screen
export default function ZOperationConfirm(context) {
    let binding = '';
    let pageContext = '';
    let pageObject = ''
    if (context.constructor.name === 'SectionedTableProxy') {
        binding = context.getPageProxy().getExecutedContextMenuItem().getBinding(); 
        libCom.setStateVariable(context, 'contextMenuSwipePage', libCom.getPageName(context));
        libCom.setStateVariable(context, 'BINDINGOBJECT', binding);
        pageContext = libMobile.getPageContext(context, libCom.getPageName(context));
        ApplicationSettings.setString(context, 'BINDINGOBJECT', JSON.stringify(binding));
    }
    else {
        pageContext = libMobile.getPageContext(context, libCom.getPageName(context));
        binding = pageContext.getBindingObject();
    }
    pageObject = libCom.getStateVariable(context, 'BINDINGOBJECT');
    return libMobile.showWarningMessage(context, context.localizeText('complete_operation_warning_message')).then(bool => {
    if (bool) {
            //libCom.enableToolBar(context, 'WorkOrderOperationDetailsPage', 'Confirm', false);
            //return context.executeAction('/SAPAssetManagerCustomisation/Actions/Workorder/Operations/ZOperationUpdate.action').then (results =>{
            //if(results)
            //{
            const equipment = binding.OperationEquipment;
            let actionArgs = {
                OperationId: binding.OperationNo,
                WorkOrderId: binding.OrderId,
                isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
                isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
            };
            actionArgs.didCreateFinalConfirmation = true;

            let action = new CompleteOperationMobileStatusAction(actionArgs);
            //libCom.enableToolBar(context, 'WorkOrderOperationDetailsPage', 'Confirm', false);
            pageContext.getClientData().confirmationArgs = {
                doCheckOperationComplete: false,
            };
            // Add this action to client data for retrieval as needed
            pageContext.getClientData().mobileStatusAction = action;

            return action.execute(pageContext).then((result) => {
                if (result) {
                    libCom.enableToolBar(context, workOrderOperationDetailsPage, 'Confirm', false);
                    //libMobile.setCompleteStatus(context);
                    let odataDate = new ODataDate();
                    libCom.setStateVariable(context, 'ConfirmationTime', odataDate.toDBTimeString(context));
                    //changed context to page contact for setcompletestatus
                    libMobile.setCompleteStatus(pageContext);
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusSuccessMessage.action').then(results => {
                        return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationCreateBlank.action').then(results => {
                            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
                            /*.then (() =>{
                            //DSb removed the autosync on plannned orders which we only complete
                             return libAutoSync.autoSyncOnStatusChange(context);
                            });*/
                        });
                    });

                } else {
                    return pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
                }
            });
            //} else { // operation udpate
            //	return pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
            // }

            //}); // operation update

        } else { //else if warning message
            return Promise.resolve(false);
        }

   });


}
