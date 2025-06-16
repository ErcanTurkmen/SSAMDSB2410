import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import ValidationLibrary from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';

export default function OperationsListViewFLAndPRT(pageProxy) {
	//DSB customistion to show all the values of the Miscellaneous PRT on the Operations list view
    let binding = pageProxy.getBindingObject();
    let val;
    //Ercan confirmed the requirement - always point to Notif FL and not WO FL. 10/10/2023
    if (!ValidationLibrary.evalIsEmpty(binding.NotifHeader_Nav)) {            
        val = binding.NotifHeader_Nav.HeaderFunctionLocation;
        //val = binding.WOHeader.HeaderFunctionLocation;
    }
    if(binding.Tools)
    {
    	let result = binding.Tools;
    	result.forEach(item => {
                if (item.PRTCategory === 'A')
                {
                	if(val)
                	{
                		val = val +" - " + item.Description;
                	}else {
                		val = item.Description;
                	}
                }
            }); 
    }
    if(!val)
    {
        val =" - "
    }
	return val;
}
