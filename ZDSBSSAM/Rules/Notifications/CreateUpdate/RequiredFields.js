import failureModeGroupValue from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateQMCodeGroupValue';
import ValidationLibrary from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import DocumentFieldsAddRequired from '../../../../SAPAssetManager/Rules/Documents/Create/DocumentFieldsAddRequired';
import CommonLib from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';


export default function RequiredFields(context) {
    const formcellContainerProxy = context.getPageProxy().getControl('FormCellContainer');
    const required = [];
    const notificationMandatoryFields = ['NotificationDescription', 'TypeLstPkr'];
    const currentPage = CommonLib.getPageName(context);
    let onCreate = CommonLib.IsOnCreate(context);
    // eslint-disable-next-line brace-style
    if ((function () { try { return context.evaluateTargetPathForAPI('#Control:PartnerPicker1').visible; } catch (exc) { return false; } })()) {
        required.push('PartnerPicker1');
    }

    // eslint-disable-next-line brace-style
    if ((function () { try { return context.evaluateTargetPathForAPI('#Control:PartnerPicker2').visible; } catch (exc) { return false; } })()) {
        required.push('PartnerPicker2');
    }

    //If a Failure Mode Group has been entered then Failure Mode Code is required or else backend will throw an error
    if (failureModeGroupValue(context)) {
        required.push('QMCodeListPicker');
    }

    // If Processing Context has been specified, Equipment and/or FLOC is required
    if (context.evaluateTargetPath('#Control:NPCSeg/#SelectedValue') === '01') {
        if (!context.evaluateTargetPath('#Control:EquipHierarchyExtensionControl').getValue() &&
            !context.evaluateTargetPath('#Control:FuncLocHierarchyExtensionControl').getValue()) {
            required.push('EquipHierarchyExtensionControl', 'FuncLocHierarchyExtensionControl');
        }
    }

    DocumentFieldsAddRequired(context, required);
    let notifObject = ZGetNotificationFieldValue(context);
    if (onCreate) {
        required.push(...NotificationItemRequiredFields(formcellContainerProxy), ...NotificationItemCauseRequiredFields(formcellContainerProxy));
        if (currentPage === 'NotificationAddPage') { // on the NotificationUpdateMalfunctionEnd page these fields are not existing
            required.push(
                ...GetUnpopulatedChildControlNamesWithPopulatedParentControl([notificationMandatoryFields], formcellContainerProxy),
                ...NotificationItemDetectionRequiredFields(formcellContainerProxy),
            );
        }

        //*** DSB Customization to remove validate for Type #´31 41. Hence checking for type 30 to validate
        //DSB customisation to add validation to 70/71/72 along with 30
        if (!notifObject.itemDescription || !notifObject.itemPartGroup || !notifObject.itemPart || !notifObject.itemDamageGroup) {
            required.push('ItemDescription', 'PartGroupLstPkr', 'PartDetailsLstPkr', 'DamageGroupLstPkr', 'DamageDetailsLstPkr');
        }
    }
    else {
        /**** DSB   Customisation to validate cause  ***/
        if (notifObject.typeLstPkr === '30' || notifObject.typeLstPkr === '70' || notifObject.typeLstPkr === '71' || notifObject.typeLstPkr === '72') {
            if (CommonLib.isDefined(notifObject.causeDescription))
            {
                if(!CommonLib.isDefined(notifObject.causeGroup) || !CommonLib.isDefined(notifObject.causeCode))
                {
                    required.push('CauseGroupLstPkr', 'CodeLstPkr');
                }
            }
            // if (!notifObject.causeDescription || (!notifObject.causeGroup && !notifObject.causeCode)) {
            //     required.push('CauseDescription', 'CauseGroupLstPkr', 'CodeLstPkr');
            // }
            /**** DSB   Customisation end  ***/
        }
    }

    return required;
}

export function NotificationItemRequiredFields(formcellContainerProxy) {
    let itemSwitch = formcellContainerProxy.getControl('ShowAdditionalFieldsSwitch');

    if ((itemSwitch && itemSwitch.getValue()) || !itemSwitch) {
        return GetUnpopulatedChildControlNamesWithPopulatedParentControl([
            ['PartGroupLstPkr', 'PartDetailsLstPkr'],  // If 'Part Group' is entered, 'Part' should be mandatory
            ['DamageGroupLstPkr', 'DamageDetailsLstPkr']],  // if 'Damage Group' is entered, 'Damage' should be mandatory
            formcellContainerProxy);
    } else {
        return '';
    }
}

export function NotificationItemCauseRequiredFields(formcellContainerProxy) {
    let itemSwitch = formcellContainerProxy.getControl('ShowAdditionalFieldsSwitch');

    if ((itemSwitch && itemSwitch.getValue()) || !itemSwitch) {
        return GetUnpopulatedChildControlNamesWithPopulatedParentControl([['CauseGroupLstPkr', 'CodeLstPkr']], formcellContainerProxy);  // if 'Cause Group' is entered, 'Cause Code' should be mandatory
    } else {
        return '';
    }
}

export function NotificationItemDetectionRequiredFields(formcellContainerProxy) {
    return GetUnpopulatedChildControlNamesWithPopulatedParentControl([['DetectionGroupListPicker', 'DetectionMethodListPicker']], formcellContainerProxy); //If a detection group has been entered then the method is required
}

function GetUnpopulatedChildControlNamesWithPopulatedParentControl(parentChildControlNames, formcellContainerProxy) {
    return parentChildControlNames.filter(([parentName, _]) => isControlPopulated(parentName, formcellContainerProxy))  // eslint-disable-line no-unused-vars
        .map(([_, childName]) => childName);  // eslint-disable-line no-unused-vars
}

export function isControlPopulated(controlName, formcellContainerProxy) {
    return !ValidationLibrary.evalIsEmpty(formcellContainerProxy.getControl(controlName).getValue());
}

export function ZGetNotificationFieldValue(context) {
    //If the user enters an item description then, make the other fields mandatory

    let itemDescription = context.evaluateTargetPath('#Control:ItemDescription/#Value');

    let itemPartGroup = CommonLib.getListPickerValue(CommonLib.getControlProxy(context, 'PartGroupLstPkr').getValue());
    let itemPart = CommonLib.getListPickerValue(CommonLib.getControlProxy(context, 'PartDetailsLstPkr').getValue());
    let itemDamageGroup = CommonLib.getListPickerValue(CommonLib.getControlProxy(context, 'DamageGroupLstPkr').getValue());
    let itemDamage = CommonLib.getListPickerValue(CommonLib.getControlProxy(context, 'DamageDetailsLstPkr').getValue());
    let causeDescription = context.evaluateTargetPath('#Control:CauseDescription/#Value');
    let causeGroup = CommonLib.getListPickerValue(CommonLib.getControlProxy(context, 'CauseGroupLstPkr').getValue());
    let causeCode = CommonLib.getListPickerValue(CommonLib.getControlProxy(context, 'CodeLstPkr').getValue());
    let typeLstPkr = CommonLib.getListPickerValue(CommonLib.getControlProxy(context, 'TypeLstPkr').getValue());
    return {
        'itemDescription': `${itemDescription}`, 'itemPartGroup': `${itemPartGroup}`, 'itemPart': `${itemPart}`, 'itemDamageGroup': `${itemDamageGroup}`,
        'itemDamage': `${itemDamage}`, 'causeDescription': `${causeDescription}`, 'causeGroup': `${causeGroup}`, 'typeLstPkr': `${typeLstPkr}`,
        'causeCode': `${causeCode}`,
    }
}