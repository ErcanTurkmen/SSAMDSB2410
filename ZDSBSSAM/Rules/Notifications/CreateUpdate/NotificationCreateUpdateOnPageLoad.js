import style from '../../../../SAPAssetManager/Rules/Common/Style/StyleFormCellButton';
import hideCancel from '../../../../SAPAssetManager/Rules/ErrorArchive/HideCancelForErrorArchiveFix';
import common from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Stylizer from '../../../../SAPAssetManager/Rules/Common/Style/Stylizer';
import libNotif from '../NotificationLibrary';
import userFeaturesLib from '../../../../SAPAssetManager/Rules/UserFeatures/UserFeaturesLibrary';
import ApplicationSettings from '../../../../SAPAssetManager/Rules/Common/Library/ApplicationSettings';
import SetUpAttachmentTypes from '../../../../SAPAssetManager/Rules/Documents/SetUpAttachmentTypes';
import EMPButtonIsVisibleOnLoad from '../../../../SAPAssetManager/Rules/Notifications/EMP/EMPButtonIsVisibleOnLoad';
import NotificationCreateUpdateFromOrder from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateFollowOnNotificationIsVisible';
import { getGeometryData, locationInfoFromObjectType, formatLocationInfo } from '../../../../SAPAssetManager/Rules/Common/GetLocationInformation';
import NotificationCreateUpdateShowFieldsChange from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateShowFieldsChange';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import NotificationItemPartGroupPickerItems from '../../../../SAPAssetManager/Rules/Notifications/Item/CreateUpdate/NotificationItemPartGroupPickerItems';
import { ValueIfExists } from '../../../../SAPAssetManager/Rules/Common/Library/Formatter';
import ZGetTechnicalObjectCodeGroup from './ZGetTechnicalObjectCodeGroup';

export default function NotificationCreateUpdateOnPageLoad(context) {
    // Create empty promise in the event of QM creation. Forces rule to wait until read is completed.
    let QMRead = Promise.resolve();
    hideCancel(context);
    SetUpAttachmentTypes(context);
    let caption;
    const onCreate = common.IsOnCreate(context);
    let container = context.getControls()[0];
    let binding = context.binding;

    common.saveInitialValues(context);

    if (NotificationCreateUpdateFromOrder(context)) {
        common.setStateVariable(context, 'isFollowOn', true);
    } else {
        common.setStateVariable(context, 'isFollowOn', false);
    }

    if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        caption = context.localizeText('record_defect');
    } else {
        if (onCreate) {
            caption = context.localizeText('add_notification');
        } else {
            caption = context.localizeText('edit_notification');

            if (!common.isCurrentReadLinkLocal(binding['@odata.readLink'])) {
                container.getControl('TypeLstPkr').setEditable(false);
            }
            ///Notification type can't be edit on local notifications
            if (common.isCurrentReadLinkLocal(binding['@odata.readLink'])) {
                container.getControl('TypeLstPkr').setEditable(false);
            }
            let formCellContainer = context.getControl('FormCellContainer');
            let stylizer = new Stylizer(['GrayText']);
            let typePkr = formCellContainer.getControl('TypeLstPkr');
            stylizer.apply(typePkr, 'Value');

            // QM-Specific
            if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
                if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                    QMRead = context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(OrderType='${context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType}', PlanningPlant='${context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}')`, [], '').then(result => {
                        if (result && result.length > 0) {
                            typePkr.setValue(result.getItem(0).QMNotifType, true).setEditable(false);
                        }
                    });
                }
            }

            //Malfunction date/time
            let startDate = formCellContainer.getControl('MalfunctionStartDatePicker');
            let startTime = formCellContainer.getControl('MalfunctionStartTimePicker');
            let endDate = formCellContainer.getControl('MalfunctionEndDatePicker');
            let endTime = formCellContainer.getControl('MalfunctionEndTimePicker');
            let startSwitch = formCellContainer.getControl('BreakdownStartSwitch');
            let endSwitch = formCellContainer.getControl('BreakdownEndSwitch');
            let effectControl = formCellContainer.getControl('EffectListPicker');
            let breakdown = formCellContainer.getControl('BreakdownSwitch').getValue();

            if (breakdown) {
                startDate.setVisible(true);
                startTime.setVisible(true);
                endDate.setVisible(true);
                endTime.setVisible(true);
                startSwitch.setVisible(true);
                endSwitch.setVisible(true);
                effectControl.setVisible(true);
            }

            if (startSwitch.getValue()) {
                startDate.setEditable(true);
                startTime.setEditable(true);
            }

            if (endSwitch.getValue()) {
                endDate.setEditable(true);
                endTime.setEditable(true);
            }
        }
    }

    context.setCaption(caption);
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
        let control = container.getControl('CodeLstPkr');
        libNotif.NotificationTaskActivityCodeQuery(control, 'CatTypeCauses', 'CauseCodeGroup').then(query => {
            let specifier = control.getTargetSpecifier();
            specifier.setQueryOptions(query);
            control.setTargetSpecifier(specifier);
        });
    }

    if (libNotif.getAddFromJobFlag(context)) {
        container.getControl('EquipHierarchyExtensionControl').setEditable(true);
        container.getControl('FuncLocHierarchyExtensionControl').setEditable(true);
    }

    NotificationCreateUpdateShowFieldsChange(context, false); //Hide the item section on load

    style(context, 'DiscardButton');
    //Set Failure Group and Detection Group
    libNotif.setFailureAndDetectionGroupQuery(context).then(() => {
        common.saveInitialValues(context);
    });

    setGroupPickersItems(context.getControl('FormCellContainer'), context).then((pickerItems) => {
        try {
            if (pickerItems[0]?.length === 1) {
                context.evaluateTargetPath('#Control:PartGroupLstPkr').setValue(pickerItems[0][0].ReturnValue, true);
            }
            if (pickerItems[1]?.length === 1) {
                context.evaluateTargetPath('#Control:DamageGroupLstPkr').setValue(pickerItems[1][0].ReturnValue, true);
            }
            if (pickerItems[2]?.length === 1) {
                context.evaluateTargetPath('#Control:CauseGroupLstPkr').setValue(pickerItems[2][0].ReturnValue, true);
            }
        } catch (error) {
            Logger.error('NotificationCreateUpdateOnPageLoad', error);
        }
    });

    /*********************** DSB Customizatoion Start  *****************/
    var equip;
    var floc;
    if (!onCreate) {
        container.getControl('PartDetailsLstPkr').setEditable(false);
        container.getControl('PartGroupLstPkr').setEditable(false);
        container.getControl('DamageGroupLstPkr').setEditable(false);
        container.getControl('DamageDetailsLstPkr').setEditable(false);
        let formCellContainerFN = context.getControl('FormCellContainer');

        let stylizerFn = new Stylizer(['GrayText']);
        let funcLoc = formCellContainerFN.getControl('FuncLocHierarchyExtensionControl');
        stylizerFn.apply(funcLoc, 'Value');

        let stylizerEq = new Stylizer(['GrayText']);
        let equipHierarchyExt = formCellContainerFN.getControl('EquipHierarchyExtensionControl');
        stylizerEq.apply(equipHierarchyExt, 'Value');

        //	binding = context.getPageProxy().binding;
        /* DSB Custosmzation for Type 31 41 hiding the feilds NotifType */
        let NotificationType = binding.NotificationType;
        if (NotificationType === '41') {
            container.getControl('PartDetailsLstPkr').setVisible(false);
            container.getControl('PartGroupLstPkr').setVisible(false);
            container.getControl('DamageGroupLstPkr').setVisible(false);
            container.getControl('DamageDetailsLstPkr').setVisible(false);
            container.getControl('CauseGroupLstPkr').setVisible(false);
            container.getControl('CodeLstPkr').setVisible(false);
        } else if (NotificationType === '31') {
            container.getControl('PartDetailsLstPkr').setVisible(false);
            container.getControl('PartGroupLstPkr').setVisible(false);
            container.getControl('DamageGroupLstPkr').setVisible(false);
            container.getControl('DamageDetailsLstPkr').setVisible(false);
            container.getControl('CauseGroupLstPkr').setVisible(false);
            container.getControl('CodeLstPkr').setVisible(false);
            container.getControl('ItemDescription').setVisible(false);
            container.getControl('CauseDescription').setVisible(false);
        }

        if (binding['@odata.readLink']) { //&& binding['@odata.type'] === '#sap_mobile.MyNotificationHeader') {

            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/Items', [], '')
                .then(function (data) {

                    // Set Damage Group picker

                    container.getControl('PartDetailsLstPkr').setValue(data.getItem(0).ObjectPart);
                    container.getControl('PartGroupLstPkr').setValue(data.getItem(0).ObjectPartCodeGroup);
                    container.getControl('ItemDescription').setValue(data.getItem(0).ItemText);
                    container.getControl('DamageGroupLstPkr').setValue(data.getItem(0).CodeGroup)
                    container.getControl('DamageGroupLstPkr').setEditable(false);
                    container.getControl('DamageDetailsLstPkr').setValue(data.getItem(0).DamageCode);

                    var aPath = "MyNotificationItems(ItemNumber='0001',NotificationNumber='" + data.getItem(0).NotificationNumber + "')/ItemCauses";
                    return context.read('/SAPAssetManager/Services/AssetManager.service', aPath, [], '')
                        .then(function (dataCauses) {
                            container.getControl('CauseGroupLstPkr').setValue(dataCauses.getItem(0).CauseCodeGroup);
                            container.getControl('CodeLstPkr').setValue(dataCauses.getItem(0).CauseCode);
                            container.getControl('CauseDescription').setValue(dataCauses.getItem(0).CauseText);

                        });

                });
        }

    } else {
        //DSB upgrade 2410 to always show Item Part and Causes enabled in case of Add Notification
        let additionalFieldsSwitch = container.getControl('ShowAdditionalFieldsSwitch').getValue();
        if (additionalFieldsSwitch) {
            context.getControl('FormCellContainer').getSection('CauseSetupSection').setVisible(true);
            context.getControl('FormCellContainer').getSection('FormCellSection4').setVisible(true);
        }
        // let groupQuery;
        // let partCodeGroup;
        // let EntitySet;

        // let partGroupPicker = container.getControl('PartGroupLstPkr');
        // let partGroupSpecifier = partGroupPicker.getTargetSpecifier();
        // var targetList = container.getControl('PartDetailsLstPkr');
        // var specifier = targetList.getTargetSpecifier();
        // let selection;
        // let notif = context.getPageProxy().binding || {};

        // let floc = binding.HeaderFunctionLocation || '';
        // let equip = binding.HeaderEquipment || '';
        // let type = binding.NotifType || '';

        // notif = {
        //     // eslint-disable-next-line brace-style
        //     'NotificationType': (function () {
        //         try {
        //             return type;
        //         } catch (e) {
        //             return '';
        //         }
        //     })(),
        //     // eslint-disable-next-line brace-style
        //     'HeaderEquipment': (function () {
        //         try {
        //             return equip;
        //         } catch (e) {
        //             return '';
        //         }
        //     })(),
        //     // eslint-disable-next-line brace-style
        //     'HeaderFunctionLocation': (function () {
        //         try {
        //             return floc;
        //         } catch (e) {
        //             return '';
        //         }
        //     })(),
        // };

        // Logger.error("Suri OnCreate before floc  read   ", floc);
        // Logger.error("Suri OnCreate before equip  read   ", equip);

        // if (floc && equip) {


        //     EntitySet = 'MyEquipments';
        //     groupQuery = "$filter=EquipId eq '" + equip + "' and length(CatalogProfile) gt 0";

        // } else if (floc) {

        //     EntitySet = 'MyFunctionalLocations';
        //     groupQuery = "$filter=FuncLocIdIntern eq '" + floc + "' and length(CatalogProfile) gt 0";
        // } else {
        //     groupQuery = "";
        // }

        // if (groupQuery !== "") {
        //     context.read('/SAPAssetManager/Services/AssetManager.service', EntitySet, [], groupQuery).then(function (results) {
        //         if (results.length > 0 && results.getItem(0).ZCodeGroup) {

        //             partCodeGroup = results.getItem(0).ZCodeGroup;
        //             Logger.error("Suri OnCreate inside  PartGroupLstPkr  read   ", partCodeGroup);
        //             partGroupPicker.setValue(partCodeGroup);
        //             // List filter partGroupLstSpecifier
        //             partGroupSpecifier.setDisplayValue('{{#Property:CodeGroup}} - {{#Property:Description}}');
        //             partGroupSpecifier.setReturnValue('{CodeGroup}');

        //             partGroupSpecifier.setEntitySet('PMCatalogProfiles');
        //             partGroupSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');

        //             partGroupSpecifier.setQueryOptions("$filter= CodeGroup eq '" + partCodeGroup + "'&$orderby=CodeGroup");
        //             // final return  
        //             partGroupPicker.setTargetSpecifier(partGroupSpecifier);


        //             libNotif.CatalogCodeQuery(context, notif, 'CatTypeObjectParts').then(function (result) {
        //                 selection = partCodeGroup;

        //                 specifier.setDisplayValue('{{#Property:Code}} - {{#Property:CodeDescription}}');
        //                 specifier.setReturnValue('{Code}');

        //                 specifier.setEntitySet('PMCatalogCodes');
        //                 specifier.setService('/SAPAssetManager/Services/AssetManager.service');

        //                 specifier.setQueryOptions("$filter=Catalog eq '" + result.Catalog + "' and CodeGroup eq '" + selection + "'&$orderby=Code");
        //                 libCom.setEditable(targetList, true);

        //                 return targetList.setTargetSpecifier(specifier).then(() => {
        //                     targetList.setValue('');
        //                 });
        //             });
        //         }

        //     });


        // }

    }
    /*********************** DSB Customizatoion End  *****************/

    if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        let typePicker = context.getControl('FormCellContainer').getControl('TypeLstPkr');
        let specifier = typePicker.getTargetSpecifier();

        specifier.setEntitySet('OrderTypes');
        specifier.setQueryOptions(`$filter=OrderType eq '${binding.InspectionLot_Nav.WOHeader_Nav.OrderType}' and PlanningPlant eq '${binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}'`);
        specifier.setService('/SAPAssetManager/Services/AssetManager.service');
        specifier.setDisplayValue('{{#Property:EAMNotifType}} - {{#Property:OrderTypeDesc}}');
        specifier.setReturnValue('{EAMNotifType}');

        typePicker.setTargetSpecifier(specifier).then(() => {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=OrderType eq '${binding.InspectionLot_Nav.WOHeader_Nav.OrderType}' and PlanningPlant eq '${binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}'`).then(function (result) {
                if (result.length === 1) {
                    typePicker.setValue(result.getItem(0).EAMNotifType);
                }
            });
        });
    }

    //Need to set assess priority button visibility here, because other screen fields have not yet been populated (hierarchy extensions)
    return EMPButtonIsVisibleOnLoad(context).then(() => {
        return setPartnerPickers(context, container).then(() => {
            // set location geometry from parent object
            const isGISAddEditEnabled = userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GISAddEdit.global').getValue());
            const prevPage = context.getPageProxy()?._page?.previousPage;

            if (isGISAddEditEnabled && prevPage?.context && !prevPage?.editModeInfo) {
                // Get type, minus prefix
                let prevPageContext = prevPage.context;
                let odataTypeString = prevPageContext.binding['@odata.type'];
                let type = odataTypeString ? odataTypeString.substring('#sap_mobile.'.length) : '';
                return getGeometryData(context.getPageProxy(), type, prevPageContext.binding, onCreate).then(geometryData => {
                    if (geometryData) {
                        // parent object's location found
                        let control = container.getControl('LocationEditTitle');
                        control.setValue(locationInfoFromObjectType(context, geometryData.ObjectType, geometryData.ObjectKey));
                        common.setStateVariable(context, 'GeometryObjectType', 'Notification');
                        ApplicationSettings.setString(context, 'Geometry', JSON.stringify({
                            geometryType: geometryData.GeometryType,
                            geometryValue: geometryData.GeometryValue,
                        }));
                        // redraw LocationButtonsSection 
                        container.getSection('LocationButtonsSection').redraw();
                    }
                    return QMRead;
                });
            } else if (prevPage?.editModeInfo) {
                let control = container.getControl('LocationEditTitle');
                control.setValue(ValueIfExists(formatLocationInfo(context, prevPage?.editModeInfo), context.localizeText('no_location_available')));
                container.getSection('LocationButtonsSection').redraw();
            }
            return QMRead;
        });
    });
}

export function setPartnerPickers(context, formCellContainer) {
    if (context.binding?.['@odata.type'] === '#sap_mobile.InspectionCharacteristic') return Promise.resolve();
    const partnerType1 = common.getStateVariable(context, 'partnerType1');
    const partnerType2 = common.getStateVariable(context, 'partnerType2');
    let partnerSpecifiers = [];

    if (common.isDefined(partnerType1)) {
        partnerSpecifiers.push(libNotif.setPartnerPickerTarget(partnerType1, formCellContainer.getControl('PartnerPicker1')));
    }

    if (common.isDefined(partnerType2)) {
        partnerSpecifiers.push(libNotif.setPartnerPickerTarget(partnerType2, formCellContainer.getControl('PartnerPicker2')));
    }

    return Promise.all(partnerSpecifiers);
}

function setGroupPickersItems(formCellContainer, context) {
    const partGroupPicker = formCellContainer.getControl('PartGroupLstPkr');
    const partCodePicker = formCellContainer.getControl('PartDetailsLstPkr');
    var partCodePickerSpecifier = partCodePicker.getTargetSpecifier();
    const damageGroupPicker = formCellContainer.getControl('DamageGroupLstPkr');
    const causeGroupPicker = formCellContainer.getControl('CauseGroupLstPkr');

    return Promise.all([NotificationItemPartGroupPickerItems(partGroupPicker), NotificationItemPartGroupPickerItems(damageGroupPicker), NotificationItemPartGroupPickerItems(causeGroupPicker), ZGetTechnicalObjectCodeGroup(context)]) //DSB enhancement 2410 to get the Z Code Group value from technical object
        .then((pickerItems) => {
            partGroupPicker.setPickerItems(pickerItems[0]);
            damageGroupPicker.setPickerItems(pickerItems[1]);
            causeGroupPicker.setPickerItems(pickerItems[2]);
            let ZCodeGroup = pickerItems[3].ZCodeGroup;
            partCodePickerSpecifier.setDisplayValue('{{#Property:Code}} - {{#Property:CodeDescription}}');
            partCodePickerSpecifier.setReturnValue('{Code}');

            partCodePickerSpecifier.setEntitySet('PMCatalogCodes');
            partCodePickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');

            partCodePickerSpecifier.setQueryOptions(`$filter=Catalog eq '${pickerItems[3].ZCatalog}' and CodeGroup eq '${pickerItems[3].ZCodeGroup}'&$orderby=Code`);

            partCodePicker.setTargetSpecifier(partCodePickerSpecifier).then(() => {
                partCodePicker.redraw(true);
                return Promise.resolve(pickerItems);
            });
        })
        .catch((error) => {
            Logger.error('setGroupPickersItems', error);
            return Promise.reject();
        });
}
