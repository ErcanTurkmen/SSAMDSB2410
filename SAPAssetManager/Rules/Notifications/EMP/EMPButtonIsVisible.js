import IsEventPriorityMatrixEnabled from '../../Common/IsEventPriorityMatrixEnabled';

/**
 * Sets initial Event Priority matrix button visibility
 * @param {IClientAPI} context
 * @returns {Promise<Boolean>} true if NotificationType and TechnicalObject exits on binding, and Plant exists (editing Notification). False if otherwise.
 */

export default function EMPButtonIsVisible(context) {
    let formCellContainer = context.getPageProxy().getControl('FormCellContainer');

    if (IsEventPriorityMatrixEnabled(context)) {
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
            return Promise.all([flocRead, equipRead]).then(results => {
                context.getPageProxy()._context.binding = context.binding;
                // Get Plant from FLOC or Equipment, otherwise empty
                let plant = results[0] || results[1] || '';
                return updateContext(plant, context, type);
            });
        }
    }
    context.getPageProxy().evaluateTargetPath('#Control:AssessmentBtn').setVisible(false);
    return Promise.resolve(false);
}

function updateContext(plant, context, type) {
    if (plant) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'ConsequenceCategories', `$filter=ConsequenceGroup_Nav/PrioritizationProfile_Nav/PrioritizationProfileLink_Nav/any(ppl:ppl/NotificationType eq '${type}' and ppl/Plant eq '${plant}')`).then(count => {
            return context.getPageProxy().evaluateTargetPath('#Control:AssessmentBtn').setVisible(count > 0);
        });
    } else {
        return context.getPageProxy().evaluateTargetPath('#Control:AssessmentBtn').setVisible(false);
    }
}
