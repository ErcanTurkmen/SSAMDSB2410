import updateGroupPickers from './UpdateGroupPickers';
import libVal from '../../Common/Library/ValidationLibrary';
import updateSoldToPartyPickers from './NotificationCreateUpdateSoldToPartyPickers';
import Logger from '../../Log/Logger';

export default function NotificationCreateUpdatePickerItems(context) {
    let controlName = context.getName();
    let formCellContainer = context.getPageProxy().getControl('FormCellContainer');
    let extensionPromise = Promise.resolve();

    // TODO: Remove this workaround when we get the hierarchy list picker support from sdk.
    // If user select a child from a hierarchy, we are losing the pageProxy binding so have to check and re-assign it.
    if (libVal.evalIsEmpty(context.getPageProxy().binding)) {
        context.getPageProxy()._context.binding = context.binding;
    }
    // Based on the control we are on, return the right list items accordingly
    switch (controlName) {
        case 'FuncLocHierarchyExtensionControl':
            {
                let funcLocControlValue = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();
                let equipmentControlValue = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
                let extension = formCellContainer.getControl('EquipHierarchyExtensionControl').getExtension();
                context.getPageProxy().getClientData().overrideValue = true;
                extensionPromise = extension.reload().then(() => {
                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', ['WorkCenter_Main_Nav/ExternalWorkCenterId'], `$expand=WorkCenter_Main_Nav&$filter=FuncLocIdIntern eq '${funcLocControlValue}'`).then((result) => {
                        const floc = result.getItem(0);
                        
                        if (floc?.WorkCenter_Main_Nav) {
                            formCellContainer.getControl('MainWorkCenterListPicker').setValue(floc.WorkCenter_Main_Nav.ExternalWorkCenterId);
                        }

                        if (funcLocControlValue && equipmentControlValue) {
                            extension.setData(equipmentControlValue);
                        }
                        return Promise.resolve(true);
                    });
                });
                break;
            }
        case 'EquipHierarchyExtensionControl':
            {
                let equipmentControlValue = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
                let extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getExtension();
                if (equipmentControlValue) {
                    extensionPromise = context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', ['FuncLocIdIntern', 'WorkCenter_Main_Nav/ExternalWorkCenterId'], `$orderby=EquipId&$filter=EquipId eq '${equipmentControlValue}'&$expand=FunctionalLocation,WorkCenter_Main_Nav`).then( results => {
                        const equipment = results.getItem(0);
                        
                        if (equipment) {
                            if (equipment.WorkCenter_Main_Nav) {
                                formCellContainer.getControl('MainWorkCenterListPicker').setValue(equipment.WorkCenter_Main_Nav.ExternalWorkCenterId);
                            }

                            if (equipment.FuncLocIdIntern) {
                                extension.setData(equipment.FuncLocIdIntern);
                            }
                        } else {
                            extension.setData('');
                        }
                        return Promise.resolve(true);
                    });
                }
                extensionPromise = Promise.resolve(true);
            }
            break;
        default:
            break;
    }

    // Clear EMP data
    delete context.getPageProxy().getClientData().EMP;
    let type = (() => {
        try {
            return context.getPageProxy().evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue');
        } catch (exc) {
            return '';
        }
    })();
    let equipment = (() => {
        try {
            return formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
        } catch (exc) {
            return '';
        }
    })();
    let floc = (() => {
        try {
            return formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();
        } catch (exc) {
            return '';
        }
    })();

    if (type) {
        // Get Equipment and Functional Location plants
        let equipRead = context.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${equipment}')`, [], '$select=MaintPlant').then(result => result.getItem(0).MaintPlant).catch(() => '');
        let flocRead = context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${floc}')`, [], '$select=MaintPlant').then(result => result.getItem(0).MaintPlant).catch(() => '');

        // Force visibility check to run after target specifiers have finished
        return Promise.all([flocRead, equipRead, extensionPromise]).then(results => {
            context.getPageProxy()._context.binding = context.binding;
            let assessmentBtn, dynamicAssessmentBtn;
            try {
                assessmentBtn = context.getPageProxy().evaluateTargetPath('#Control:AssessmentBtn');
                dynamicAssessmentBtn = context.getPageProxy().evaluateTargetPath('#Control:DynamicAssessmentBtn');
            } catch (err) {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), err);
            }
            // Get Plant from FLOC or Equipment, otherwise empty
            let plant = results[0] || results[1] || '';
            if (plant) {
                return context.count('/SAPAssetManager/Services/AssetManager.service', 'ConsequenceCategories', `$filter=ConsequenceGroup_Nav/PrioritizationProfile_Nav/PrioritizationProfileLink_Nav/any(ppl:ppl/NotificationType eq '${type}' and ppl/Plant eq '${plant}')`).then(count => {
                    if (assessmentBtn) assessmentBtn.setVisible(count > 0);
                    if (dynamicAssessmentBtn) dynamicAssessmentBtn.setVisible(count > 0);
                }).catch(() => Promise.resolve());
            } else {
                if (assessmentBtn) assessmentBtn.setVisible(false);
                if (dynamicAssessmentBtn) dynamicAssessmentBtn.setVisible(false);
                return Promise.resolve(); 
            }
        }).then(() => updateGroupPickers(context.getPageProxy())).then(() => updateSoldToPartyPickers(context));
    } else {
        context.getPageProxy().evaluateTargetPath('#Control:AssessmentBtn').setVisible(false);
        return Promise.resolve();
    }
}
