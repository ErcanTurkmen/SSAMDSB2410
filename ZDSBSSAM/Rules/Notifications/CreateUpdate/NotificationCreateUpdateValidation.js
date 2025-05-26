import libNotif from '../NotificationLibrary';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function NotificationCreateUpdateValidation(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    // //Check field data against business logic here
    // //Return true if validation succeeded, or False if failed
    // return libNotif.NotificationCreateUpdateValidation(pageClientAPI).then(result => {
    //     return result;
    // });

    let formCellContainer = pageClientAPI.getControl('FormCellContainer');
    //DSB customisation for the issue:197382 / 2023 Notification Update Page can result in blank technical objects
    var floc;
    var onCreate = libCom.IsOnCreate(pageClientAPI);
    if (onCreate) {
        floc = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();

    } else {
        let flocListPicker = formCellContainer.getControl('FunctionalLocationLstPkr');
        floc = libCom.getListPickerValue(flocListPicker.getValue());

    }

    var equipment;
    if (onCreate) {
        equipment = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();

    } else {
        let equipListPicker = formCellContainer.getControl('EquipmentLstPkr');
        equipment = libCom.getListPickerValue(equipListPicker.getValue());


    }
    let typeListPicker = formCellContainer.getControl('TypeLstPkr');
    let notifType = libCom.getListPickerValue(typeListPicker.getValue());

    // DSB customisation to check for equipment if it exists. Check field data against business logic here
    //Return true if validation succeeded, or False if failed
    return libNotif.NotificationCreateUpdateValidation(pageClientAPI).then(result => {
        if (!result) {
            return result;


        } else {
            if (!floc && notifType === '30' && onCreate) {
                let messagefloc = pageClientAPI.localizeText('field_is_required');
                var flocControl = formCellContainer.getControl('FuncLocHierarchyExtensionControl');
                libCom.executeInlineControlError(pageClientAPI, flocControl, messagefloc);
                return false;
            }
            if (!equipment && notifType === '30' && onCreate) {
                let queryOption = "$filter=FuncLocId eq '" + floc + "' &$orderby=EquipId";


                return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', [], queryOption).then(function (data) {
                    if (data && data.length > 0 && data.getItem(0).EquipId) {
                        let message = pageClientAPI.localizeText('zvalidation_notification_add_equipment');
                        let eqControl = formCellContainer.getControl('EquipHierarchyExtensionControl');
                        libCom.executeInlineControlError(pageClientAPI, eqControl, message);
                        return false;
                    } else {
                        return result;
                    }
                });
            } else {
                return result;
            }
        }
    });
}
