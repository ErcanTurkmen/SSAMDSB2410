import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libMobile from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import CompleteOperationMobileStatusAction from '../../../../SAPAssetManager/Rules/Operations/MobileStatus/CompleteOperationMobileStatusAction';
import libOprMobile from '../../../../SAPAssetManager/Rules/Operations/MobileStatus/OperationMobileStatusLibrary';
import ODataDate from '../../../../SAPAssetManager/Rules/Common/Date/ODataDate';
import libAutoSync from '../../../../SAPAssetManager/Rules/ApplicationEvents/AutoSync/AutoSyncLibrary';

const workOrderOperationDetailsPage = 'WorkOrderOperationDetailsPage';
//DSB customisation
// change in confirmation to only post blank confirmation and bypass asking for time capture.
// enhanced to capture operation status to complete as it now needs to be shown on the list screen
export default function ZOperationConfirmFromOpListSwipe(context) {
    //Save the name of the page where user swipped the context menu from. It's used in other code to check if a context menu swipe was done.
    libCom.setStateVariable(context, 'contextMenuSwipePage', libCom.getPageName(context));
    
    //Save the operation binding object. Coming from a context menu swipe does not allow us to get binding object using context.binding.
    libCom.setBindingObject(context);
    let binding = libCom.getBindingObject(context);
    //Set ChangeStatus property to 'Completed'.
    //ChangeStatus is used by OperationMobileStatusFailureMessage.action & OperationMobileStatusSuccessMessage.action
    context.getPageProxy().getClientData().ChangeStatus = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    let pageContext = context.getPageProxy();
    //let pageContext = libMobile.getPageContext(context, workOrderOperationDetailsPage);
	
	return libMobile.showWarningMessage(context, context.localizeText('complete_operation_warning_message')).then(bool => {
            if (bool) {
            	//libCom.enableToolBar(context, 'WorkOrderOperationDetailsPage', 'Confirm', false);
            	//return context.executeAction('/SAPAssetManagerCustomisation/Actions/Workorder/Operations/ZOperationUpdate.action').then (results =>{
            		//if(results)
            		 //{
                        //const pageBinding = pageContext.getBindingObject();
                      //let binding = pageContext.getBindingObject();
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
                        
                        return action.execute(pageContext).then((result) =>{
                        	if(result)
                        	{
	                        	//libCom.enableToolBar(context, workOrderOperationDetailsPage, 'Confirm', false);
	                        	//libMobile.setCompleteStatus(context);
	                        	let odataDate = new ODataDate();
    							libCom.setStateVariable(context, 'ConfirmationTime', odataDate.toDBTimeString(context));
    							libMobile.setCompleteStatus(context);
        						return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusSuccessMessage.action').then (results =>{
	                        		/*return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationCreateBlank.action').then (results =>{
                                       return libAutoSync.autoSyncOnStatusChange(context);
                                    }).finally(() => {
                                        //Clear variables set for swipe
	                        			libCom.removeBindingObject(context);
							            libCom.removeStateVariable(context, 'contextMenuSwipePage');
							            delete context.getPageProxy().getClientData().ChangeStatus;
                                    });   */
                                     //DSb removed the autosync on plannned orders which we only complete
                                    return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationCreateBlank.action').finally(() => {
                                        //Clear variables set for swipe
	                        			libCom.removeBindingObject(context);
							            libCom.removeStateVariable(context, 'contextMenuSwipePage');
							            delete context.getPageProxy().getClientData().ChangeStatus;
                                    });   
	                        		
        						});
        						
                        	}else {
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
