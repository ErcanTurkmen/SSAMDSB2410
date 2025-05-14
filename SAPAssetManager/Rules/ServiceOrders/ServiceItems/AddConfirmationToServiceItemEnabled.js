import S4ServiceLibrary from '../S4ServiceLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
 * The function can be executed for S4ServiceOrder, S4ServiceItem, S4ServiceConfirmation and S4ServiceConfirmationItem
 * 
 * To add a confirmation we need to check the following steps:
 *  1. current entity is not completed
 *  2. S4ServiceOrder is not completed
 *  3.  ̶S̶4̶S̶e̶r̶v̶i̶c̶e̶O̶r̶d̶e̶r̶ ̶h̶a̶s̶ ̶r̶e̶l̶e̶a̶s̶e̶d̶ ̶s̶t̶a̶t̶u̶s̶ (error message will show on action)
 *  4.  ̶S̶4̶S̶e̶r̶v̶i̶c̶e̶O̶r̶d̶e̶r̶/̶S̶4̶S̶e̶r̶v̶i̶c̶e̶I̶t̶e̶m̶ ̶h̶a̶s̶ ̶n̶o̶ ̶e̶r̶r̶o̶r̶s̶ (error message will show on action)
 *  5. S4ServiceOrder/S4ServiceItem has no confirmations
 * @param {ClientAPI} context 
 * @param {S4ServiceOrder/S4ServiceItem/S4ServiceConfirmation/S4ServiceConfirmationItem} bindingObject 
 * @returns {Promise<boolean>}
 */
export default async function AddConfirmationToServiceItemEnabled(context, bindingObject) {
    const binding = bindingObject || context.binding;
    const isServiceItem = binding['@odata.type'] === '#sap_mobile.S4ServiceItem';

    const checkIfObjectNotCompleted = S4ServiceLibrary.isServiceObjectCompleted(context, binding).then(isCompleted => !isCompleted);
    const checkIfParentObjectNotCompleted = isServiceItem ? checkIfServiceOrderNotCompleted(context, binding) : Promise.resolve(true);
    const checkIfObjectHasNoFinalCompletedConfirmation = checkIfObjectHasNoRelatedFinalCompletedConfirmation(context, binding);
   
    const [
        isObjectNotCompleted,
        parentObjectNotCompleted,
        isObjectHasNoFinalCompletedConfirmation,
    ] = await Promise.all([checkIfObjectNotCompleted, checkIfParentObjectNotCompleted, checkIfObjectHasNoFinalCompletedConfirmation]);
    
    return isObjectNotCompleted && parentObjectNotCompleted && isObjectHasNoFinalCompletedConfirmation;
}

async function checkIfServiceOrderNotCompleted(context, binding) {
    const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const serviceOrder = await context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/S4ServiceOrder_Nav', [], '$expand=MobileStatus_Nav').then(result => result.length ? result.getItem(0) : null);
    const mobileStatus = serviceOrder?.MobileStatus_Nav?.MobileStatus;

    return mobileStatus !== COMPLETED;
}

async function checkIfObjectHasNoRelatedFinalCompletedConfirmation(context, binding) {
    const dataType = binding['@odata.type'];
    
    // retrieves all related confirmations
    let confirmations;
    if (dataType === '#sap_mobile.S4ServiceConfirmation') {
        confirmations = await Promise.resolve([]);
    } else {
        let query = '$expand=S4ServiceConfirms_Nav/MobileStatus_Nav&$filter=sap.entityexists(S4ServiceConfirms_Nav)';
        let entity = 'S4ServiceConfirmationTranHistories';

        if (dataType === '#sap_mobile.S4ServiceOrder') {
            entity = binding['@odata.readLink'] + '/S4ServiceConfirmationTranHistory_Nav';
            query = '$expand=S4ServiceConfirmation_Nav/MobileStatus_Nav&$filter=sap.entityexists(S4ServiceConfirmation_Nav)';
        } else if (dataType === '#sap_mobile.S4ServiceItem') {
            entity = binding['@odata.readLink'] + '/S4ServiceOrder_Nav/TransHistories_Nav';
        }

        confirmations = await context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], query).then(result => result.length ? result : []);
    }

    const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const someConfirmationIsFinal = confirmations.some(confirmation => {
        if (confirmation) {
            const confirmationNav = confirmation.S4ServiceConfirms_Nav || confirmation.S4ServiceConfirmation_Nav;
            const isFinal = confirmationNav?.FinalConfirmation === 'X' || confirmationNav?.FinalConfirmation === 'Y';
            const isCompleted = confirmationNav?.MobileStatus_Nav?.MobileStatus === COMPLETED;
            return isFinal && isCompleted;
        }
        return false;
    });

    return !someConfirmationIsFinal;
}
