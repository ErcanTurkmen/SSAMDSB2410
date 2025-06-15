
import Logger from '../../../../../../SAPAssetManager/Rules/Log/Logger';
import ODataDate from '../../../../../../SAPAssetManager/Rules/Common/Date/ODataDate';
import libCom from '../../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

//DSB customisation to validate the equipment - class/charac - date to be within the current date year/month. Else exipred and throw error as user cannot add PRT

export default function ZPRTEquipmentCreateUpdateValidation(pageClientAPI) {
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    //let equipid = '1215';
    const charId = pageClientAPI.getGlobalDefinition('/ZDSBSSAM/Globals/WorkOrders/Operations/PRT/ZCalibrationCharacteristic.global').getValue(); //'0000000837';
    var dict = libCom.getControlDictionaryFromPage(pageClientAPI);
    let equipid = libCom.getListPickerValue(dict.EquipmentLstPkr.getValue());
    //PRT Equipment search is online so checking class characteristic in online service 
    return pageClientAPI.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'EquipmentClassCharValues', [], "$filter=EquipId eq '" + equipid + "' and CharId eq '" + charId + "' &$orderby=CharId,EquipId,CharValDesc asc,CharValFrom asc").then(function (results) {
        //for (var i = 0; i < results.length; i++) {
        if (results.length > 0) {
            // DSB update: the date when changed in backend is returned as another record. So the entity has 2 records for the date
            //hence the change to get the last updated index to fetch the value
            //else we were getting always the first value which is incorrect
            //this is due to the 2410 backend changes
            var charVal = '';
            let callibrationRecord = results.find(oValue => oValue.CharId === `${charId}`);
            if (callibrationRecord) {
                if (typeof callibrationRecord === 'object') {
                    charVal = callibrationRecord.CharValFrom;
                }
                else {
                    const lastUpdatedValueIndex = callibrationRecord.length ? callibrationRecord.length - 1 : 0;
                    //var charVal = results.getItem(0).CharValFrom;
                    charVal = callibrationRecord.getItem(lastUpdatedValueIndex).CharValFrom;
                }
                var charDateYear = charVal.toString().substring(0, 4);
                var charDateMon = charVal.toString().substring(4, 6);
                let currentYear = new ODataDate().toDBDate(pageClientAPI).getFullYear().toString();
                let currentMon = (new ODataDate().toDBDate(pageClientAPI).getMonth() + 1).toString();
                if (currentMon.length < 2) {
                    currentMon = "0" + currentMon;
                }

                if (charDateYear < currentYear) {
                    var messageText = pageClientAPI.localizeText('zPRTAddEquipment_error');
                    var captionText = pageClientAPI.localizeText('error');
                    return libCom.showErrorDialog(pageClientAPI, messageText, captionText);
                }
                else if (charDateYear === currentYear && charDateMon < currentMon) {
                    var messageText = pageClientAPI.localizeText('zPRTAddEquipment_error');
                    var captionText = pageClientAPI.localizeText('error');
                    return libCom.showErrorDialog(pageClientAPI, messageText, captionText);
                }
                return true;
            }
            else {
                var messageText = pageClientAPI.localizeText('zPRTAddEquipment_error');
                var captionText = pageClientAPI.localizeText('error');
                return libCom.showErrorDialog(pageClientAPI, messageText, captionText);
            }
        }
        else // expiry date not maintained, hence throw an error. PRT cannot be added
        {
            var messageText = pageClientAPI.localizeText('zPRTAddEquipment_error');
            var captionText = pageClientAPI.localizeText('error');
            return libCom.showErrorDialog(pageClientAPI, messageText, captionText);
        }

    });
}
