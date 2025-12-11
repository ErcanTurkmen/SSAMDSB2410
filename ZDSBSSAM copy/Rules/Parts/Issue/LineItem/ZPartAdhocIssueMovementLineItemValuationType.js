import libPart from '../../../../../SAPAssetManager/Rules/Parts/PartLibrary';
import libCom from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import {SplitReadLink} from '../../../../../SAPAssetManager/Rules/Common/Library/ReadLinkUtils';
import Logger from '../../../../../SAPAssetManager/Rules/Log/Logger';

export default function ZPartAdhocIssueMovementLineItemValuationType(pageClientAPI) {
    
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    let materialNum = SplitReadLink(libCom.getListPickerValue(libCom.getFieldValue(pageClientAPI, 'MaterialLstPkr', '', null, true))).MaterialNum;
    let plant = libCom.getListPickerValue(libCom.getFieldValue(pageClientAPI, 'PlantLstPkr', '', null, true));
   
    const query = `$filter=Plant eq '${plant}' and MaterialNum eq '${materialNum}'&$expand=MaterialValuation_Nav`;

    return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialPlants', [], query).then(data => {
        if (data && data.getItem) {
            const valuations = data.getItem(0).MaterialValuation_Nav;
            const length = valuations.length;

            if (length) {
                return "NY";
            }
            else{
                return "";
            }
        }
        return "";
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/Inventory/CategoryValuation.global').getValue(),`ValuationPickerItems(context) error: ${error}`);
        return "";
    });
     //return libPart.zPartAdhocMovementLineItemCreateUpdateSetODataValue(pageClientAPI, 'ValuationType');
}
