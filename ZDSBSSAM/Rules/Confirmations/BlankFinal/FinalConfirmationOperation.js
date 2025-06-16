import libMobile from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function FinalConfirmationOperation(context) {
	let operation;
    if (!libCom.getStateVariable(context, 'contextMenuSwipePage')) {
	    const workOrderOperationDetailsPage = 'WorkOrderOperationDetailsPage';
		let pageContext = libMobile.getPageContext(context, workOrderOperationDetailsPage);
		let binding = pageContext.getBindingObject();
		
		let operation = binding.OperationNo;
		return operation;
    }
    else
    {
    	let binding = libCom.getBindingObject(context);
    	operation=binding.OperationNo;	
		return operation;
    }
    
}
