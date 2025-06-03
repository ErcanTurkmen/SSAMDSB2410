import libNotif from '../NotificationLibrary';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function NotificationCreateUpdateValidation(pageClientAPI) {
    let message = '';
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
        floc = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue() || pageClientAPI.binding.HeaderFlocId;

    } else {
        let flocListPicker = formCellContainer.getControl('FunctionalLocationLstPkr');
        floc = libCom.getListPickerValue(flocListPicker.getValue());

    }

    var equipment;
    if (onCreate) {
        equipment = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue() || pageClientAPI.binding.HeaderEquipment;

    } else {
        let equipListPicker = formCellContainer.getControl('EquipmentLstPkr');
        equipment = libCom.getListPickerValue(equipListPicker.getValue());


    }
    let typeListPicker = formCellContainer.getControl('TypeLstPkr');
    let notifType = libCom.getListPickerValue(typeListPicker.getValue());
    let itemPartGroup = libCom.getListPickerValue(formCellContainer.getControl('PartGroupLstPkr').getValue());
    let itemPart = libCom.getListPickerValue(formCellContainer.getControl('PartDetailsLstPkr').getValue());
    let damageGroup = libCom.getListPickerValue(formCellContainer.getControl('DamageGroupLstPkr').getValue());
    let damageCode = libCom.getListPickerValue(formCellContainer.getControl('DamageDetailsLstPkr').getValue());

    // DSB customisation to check for equipment if it exists. Check field data against business logic here
    //Return true if validation succeeded, or False if failed
    return libNotif.NotificationCreateUpdateValidation(pageClientAPI).then(result => {
        if (!result) {
            return result;


        } else {
            if (!floc && !equipment && notifType === '30' && onCreate) {
                let messagefloc = pageClientAPI.localizeText('field_is_required');
                var flocControl = formCellContainer.getControl('FuncLocHierarchyExtensionControl');
                libCom.executeInlineControlError(pageClientAPI, flocControl, messagefloc);
                return false;
            }
            if (!equipment && notifType === '30' && onCreate) {
                let queryOption = "$filter=FuncLocId eq '" + floc + "' &$orderby=EquipId";
                let onlineFlag = libCom.getStateVariable(pageClientAPI, 'ZOnlineSearch'); //DSB customization to check if FL has equipment in case when the FL is searched online and notification is created
                if (onlineFlag) {
                    let onlineQuery = `$filter=FuncLocIdIntern eq '${floc}' and SuperiorEquip eq ''&$orderby=EquipId`;
                    return pageClientAPI.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'Equipments', [], onlineQuery).then(function (data) {
                        if (data && data.length > 0 && data.getItem(0).EquipId) {
                            message = pageClientAPI.localizeText('zvalidation_notification_add_equipment');
                            //let flControl = formCellContainer.getControl('FuncLocHierarchyExtensionControl');
                            return pageClientAPI.executeAction({
                                'Name': '/ZDSBSSAM/Actions/FunctionalLocation/ZFunctionLocEquipmentExistErrorMessage.action',
                                'Properties': {
                                    'Message': message,
                                },
                            });
                        } else {
                            return result;
                        }
                    });
                }
                else {
                    return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', [], queryOption).then(function (data) {
                        if (data && data.length > 0 && data.getItem(0).EquipId) {
                            message = pageClientAPI.localizeText('zvalidation_notification_add_equipment');
                            let eqControl = formCellContainer.getControl('EquipHierarchyExtensionControl');
                            libCom.executeInlineControlError(pageClientAPI, eqControl, message);
                            return false;
                        } else {
                            return result;
                        }
                    });
                }
            }
            if (notifType === '30' && onCreate && (!itemPart || !itemPartGroup)) {
                message = pageClientAPI.localizeText('zvalidation_item_mandatory');
                // if (!itemPart) {
                    libCom.executeInlineControlError(pageClientAPI, formCellContainer.getControl('PartDetailsLstPkr'), message);
                // }
                // else {
                //     libCom.executeInlineControlError(pageClientAPI, formCellContainer.getControl('DamageDetailsLstPkr'), pageClientAPI.localizeText('zvalidation_damage_mandatory'));
                // }
                return false;
            }
            else {
                return result;
            }
        }
    });
}
