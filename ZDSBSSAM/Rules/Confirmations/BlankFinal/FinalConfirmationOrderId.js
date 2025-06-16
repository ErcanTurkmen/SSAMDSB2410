import libMobile from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function FinalConfirmationOrderId(context) {
	
	 if (!libCom.getStateVariable(context, 'contextMenuSwipePage')) 
	 {
		const workOrderOperationDetailsPage = 'WorkOrderOperationDetailsPage';
		let pageContext = libMobile.getPageContext(context, workOrderOperationDetailsPage);
		let binding = pageContext.getBindingObject();
		let orderId=binding.OrderId;
		if (orderId === undefined) {
	        // Retrieve the readlink from the previous page
	        // This is because Client data is not read from the same context the action was executed on
	       orderId = context.evaluateTargetPath('#Page:-Previous/#ClientData/#Property:FinalConfirmationOrderID');
	    }
	    return orderId;
	 }
	 else
     {
    	let binding = libCom.getBindingObject(context);
    	return binding.OrderId;
     }
   
}
