import style from '../../Common/Style/StyleFormCellButton';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import common from '../../Common/Library/CommonLibrary';
import Stylizer from '../../Common/Style/Stylizer';
import libNotif from '../NotificationLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import SetUpAttachmentTypes from '../../Documents/SetUpAttachmentTypes';
import EMPButtonIsVisibleOnLoad from '../EMP/EMPButtonIsVisibleOnLoad';
import NotificationCreateUpdateFromOrder from './NotificationCreateUpdateFollowOnNotificationIsVisible';
import { getGeometryData, locationInfoFromObjectType, formatLocationInfo } from '../../Common/GetLocationInformation';
import NotificationCreateUpdateShowFieldsChange from './NotificationCreateUpdateShowFieldsChange';
import Logger from '../../Log/Logger';
import NotificationItemPartGroupPickerItems from '../Item/CreateUpdate/NotificationItemPartGroupPickerItems';
import { ValueIfExists } from '../../Common/Library/Formatter';

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
            if (userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
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
    if (userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
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

    setGroupPickersItems(context.getControl('FormCellContainer')).then((pickerItems) => {
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
  
    if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        let typePicker = context.getControl('FormCellContainer').getControl('TypeLstPkr');
        let specifier = typePicker.getTargetSpecifier();

        specifier.setEntitySet('OrderTypes');
        specifier.setQueryOptions(`$filter=OrderType eq '${binding.InspectionLot_Nav.WOHeader_Nav.OrderType}' and PlanningPlant eq '${binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}'`);
        specifier.setService('/SAPAssetManager/Services/AssetManager.service');
        specifier.setDisplayValue('{{#Property:EAMNotifType}} - {{#Property:OrderTypeDesc}}');
        specifier.setReturnValue('{EAMNotifType}');

        typePicker.setTargetSpecifier(specifier).then(() => {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=OrderType eq '${binding.InspectionLot_Nav.WOHeader_Nav.OrderType}' and PlanningPlant eq '${binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}'`).then(function(result) {
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
            const isGISAddEditEnabled = userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GISAddEdit.global').getValue());
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
        partnerSpecifiers.push(libNotif.setPartnerPickerTarget(partnerType1, formCellContainer.getControl('PartnerPicker1'))) ;
    }

    if (common.isDefined(partnerType2)) {
        partnerSpecifiers.push(libNotif.setPartnerPickerTarget(partnerType2, formCellContainer.getControl('PartnerPicker2')));
    }

    return Promise.all(partnerSpecifiers);
}

function setGroupPickersItems(formCellContainer) {
    const partGroupPicker = formCellContainer.getControl('PartGroupLstPkr');
    const damageGroupPicker = formCellContainer.getControl('DamageGroupLstPkr');
    const causeGroupPicker = formCellContainer.getControl('CauseGroupLstPkr');

    return Promise.all([NotificationItemPartGroupPickerItems(partGroupPicker),  NotificationItemPartGroupPickerItems(damageGroupPicker), NotificationItemPartGroupPickerItems(causeGroupPicker)])
        .then((pickerItems) => {
            partGroupPicker.setPickerItems(pickerItems[0]);
            damageGroupPicker.setPickerItems(pickerItems[1]);
            causeGroupPicker.setPickerItems(pickerItems[2]);
            return Promise.resolve(pickerItems);
        })
        .catch((error) => {
            Logger.error('setGroupPickersItems', error);
            return Promise.reject();
        });
}
