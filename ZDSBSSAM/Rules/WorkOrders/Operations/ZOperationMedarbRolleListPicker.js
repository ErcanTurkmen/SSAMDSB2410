/**
   * Loop through all the values of ZMedarRolle for the operations and add it to the list picker
   * 
   * @param {} context
   * 
   * @returns {string} returns the sorted array of values with all the characteristic
   * 
   */

import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libVal from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import operationEntity from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/OperationsEntitySet';

export default function OperationZMedarbRolleListPicker(context) {
    var jsonResult = [];
	let binding = context?.binding;
	if(binding?.Operations)
	{
	    let oprlist = binding.Operations;
	   /*for (var k = 0; k < oprlist.length; k++) {
			let resultObj = oprlist[k].ZMedarbRolle;
			if(resultObj)
			{// && !jsonResult.includes(resultObj)){
			
			    jsonResult.push(
			                {
			                    'DisplayValue': `${resultObj}`,
			                    'ReturnValue': resultObj,
			                });
			}
	    }
	    //return jsonResult;
	    	const uniqueSet = new Set(jsonResult.map(item => JSON.stringify(item)));
            let finalResult = [...uniqueSet].map(item => JSON.parse(item));
            return finalResult; */
            
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', [], "$filter=OrderId eq '" + binding.OrderId + "'&$orderby=ZMedarbRolle").then(obArray => {
            obArray.forEach(function(element) {
            if(element.ZMedarbRolle)
            {
                jsonResult.push(
                    {
                        'DisplayValue': `${element.ZMedarbRolle}`,
                        'ReturnValue': element.ZMedarbRolle,
                    });
            }
            });
            const uniqueSet = new Set(jsonResult.map(item => JSON.stringify(item)));
            let finalResult = [...uniqueSet].map(item => JSON.parse(item));
            return finalResult;
        });
	    
	} else
	{
		return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', [], "$orderby=ZMedarbRolle").then(obArray => {
            obArray.forEach(function(element) {
            if(element.ZMedarbRolle)
            {
                jsonResult.push(
                    {
                        'DisplayValue': `${element.ZMedarbRolle}`,
                        'ReturnValue': element.ZMedarbRolle,
                    });
            }
            });
            const uniqueSet = new Set(jsonResult.map(item => JSON.stringify(item)));
            let finalResult = [...uniqueSet].map(item => JSON.parse(item));
            return finalResult;
        });
	} 
  
}
