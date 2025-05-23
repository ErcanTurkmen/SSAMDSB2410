import libCom from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libVal from '../../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import { SplitReadLink } from '../../../../../SAPAssetManager/Rules/Common/Library/ReadLinkUtils';
import Logger from '../../../../../SAPAssetManager/Rules/Log/Logger';
import ResetValidationOnInput from '../../../../../SAPAssetManager/Rules/Common/Validation/ResetValidationOnInput';


export default function ZAdhocPartsIssueSerialPartsAllowed(context) {
    //return context.binding.SerialNoProfile === '' ? false : true;
    let matnum = "";
    let readlink = SplitReadLink(libCom.getListPickerValue(libCom.getFieldValue(context, 'MaterialLstPkr', '', null, true)));
    if (readlink) {
        matnum = readlink.MaterialNum;
    }
    let plant = libCom.getListPickerValue(libCom.getFieldValue(context, 'PlantLstPkr', '', null, true));
    //let storageLocation =libCom.getListPickerValue(libCom.getFieldValue(pageClientAPI, 'StorageLocationLstPkr', '', null, true));
    if (matnum) {
        let query = "MaterialPlants(MaterialNum='" + matnum + "',Plant='" + plant + "')";
        return context.read('/SAPAssetManager/Services/AssetManager.service', query, [], '').then(function (results) {
            if (results && results.length > 0) {
                let row = results.getItem(0);
                if (row.SerialNumberProfile) {
                    return true;
                }
            }
            return false;
        });
    }
}