import IsEventPriorityMatrixEnabled from '../../Common/IsEventPriorityMatrixEnabled';
import libPersona from '../../Persona/PersonaLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

/**
 * Sets initial Event Priority matrix button visibility
 * @param {IClientAPI} context
 * @returns {Promise<Boolean>} true if NotificationType and TechnicalObject exits on binding, and Plant exists (editing Notification). False if otherwise.
 * This is called when Notification create/update page is loaded, so context should be a page
 */

export default function EMPButtonIsVisibleOnLoad(context) {
    let promiseArray = [];

    if (IsEventPriorityMatrixEnabled(context)) {
        // Clear EMP data
        delete context.getClientData().EMP;

        //Get the deault values for type, equipment and floc
        promiseArray.push(NotificationTypeLstPkrDefault(context));
        promiseArray.push(getDefaultEquipmentOrFlocValue(context, 'FuncLoc'));
        promiseArray.push(getDefaultEquipmentOrFlocValue(context, 'Equipment'));
       
        return Promise.all(promiseArray).then(values => {
            let type = values[0];
            let floc = values[1];
            let equipment = values[2];

            if (type) {
                // Get Equipment and Functional Location plants
                let equipRead = context.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${equipment}')`, [], '$select=MaintPlant').then(result => result.getItem(0).MaintPlant).catch(() => '');
                let flocRead = context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${floc}')`, [], '$select=MaintPlant').then(result => result.getItem(0).MaintPlant).catch(() => '');
        
                return Promise.all([flocRead, equipRead]).then(results => {
                    // Get Plant from FLOC or Equipment, otherwise empty
                    let plant = results[0] || results[1] || '';
                    if (plant) {
                        return context.count('/SAPAssetManager/Services/AssetManager.service', 'ConsequenceCategories', `$filter=ConsequenceGroup_Nav/PrioritizationProfile_Nav/PrioritizationProfileLink_Nav/any(ppl:ppl/NotificationType eq '${type}' and ppl/Plant eq '${plant}')`).then(count => {
                            return context.evaluateTargetPath('#Control:AssessmentBtn').setVisible(count > 0);
                        });
                    } else {
                        return context.evaluateTargetPath('#Control:AssessmentBtn').setVisible(false);
                    }
                });
            }
            context.evaluateTargetPath('#Control:AssessmentBtn').setVisible(false);
            return Promise.resolve();
        });
    }
    context.evaluateTargetPath('#Control:AssessmentBtn').setVisible(false);
    return Promise.resolve();
}

/**
 * Get default value for equipment or floc
 * @param {*} context 
 * @param {*} name 
 * @returns 
 */
function getDefaultEquipmentOrFlocValue(context, name) {
    if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        return Promise.resolve(setDefaultListPickerValue(context, name));
    } else {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$filter=OrderId eq '${context.binding.OperationOrderId}'`).then(result => {
            let workOrder = result.getItem(0);
            return setDefaultListPickerValue(context, name, workOrder);
        });
    }
}

/**
 * Process value request
 * @param {*} context 
 * @param {*} name 
 * @param {*} workOrder 
 * @returns 
 */
function setDefaultListPickerValue(context, name, workOrder = {}) {
    if (name === 'FuncLoc') {
        return context.binding.HeaderFunctionLocation || workOrder.HeaderFunctionLocation;
    } else {
        return context.binding.HeaderEquipment || workOrder.HeaderEquipment;
    }
}

/**
 * Get default picker value for notif type
 * @param {*} context 
 * @returns 
 */
function NotificationTypeLstPkrDefault(context) {

    let bindingObject = context.binding;

    if (bindingObject['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(OrderType='${bindingObject.InspectionLot_Nav.WOHeader_Nav.OrderType}', PlanningPlant='${bindingObject.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}')`, [], '').then(result => {
            if (result && result.length > 0) {
                return result.getItem(0).EAMNotifType;
            }
            return libCommon.getAppParam(context, 'NOTIFICATION', 'NotificationType');
        });
    }

    if (bindingObject && bindingObject.NotificationType) {
        return Promise.resolve(bindingObject.NotificationType);
    } else if (libPersona.isMaintenanceTechnician(context)) {
        let defaultType = libCommon.getAppParam(context, 'NOTIFICATION', 'NotificationType');

        if (defaultType) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], `$filter=NotifType eq '${defaultType}'`).then(types => {
                if (types && types.length > 0) {
                    return types.getItem(0).NotifType;
                }
                return undefined;
            });
        }
        return Promise.resolve(undefined);
    }
}
