import loadPersonaOverview from './LoadPersonaOverview';

/**
 * Acts as a wrapper for loadPersonaOverview
 * Redraw of existing page elements is not correctly populating KPI and map extension sections otherwise
 * Only do this if the user is not currently on a modal screen
 * @param {*} context 
 * @returns 
 */
export default function ReloadPersonaOverview(context) {
    return Promise.all(getModalArray(context)).then(() => {
        return loadPersonaOverview(context);
    }).catch(() => { //A modal screen exists, so do not navigate to overview screen
        return Promise.resolve();
    });
}

/**
 * Check to see if the user is on the modal screen
 * @param {*} context 
 * @param {*} screenName 
 * @returns - Promise resolve or reject.  Reject means the screen is currently loaded
 */
function checkForModal(context, screenName) {
    try {
        context.evaluateTargetPathForAPI('#Page:' + screenName);
        return Promise.reject(); //User is on a modal, so fail the promise
    } catch {
        return Promise.resolve(); //Screen not found, OK to proceed
    }
}

/**
 * Array of modal screens to check for on the screen stack
 * Add any additional modals here
 */
export function getModalArray(context) {
    let screens = [];

    screens.push(checkForModal(context, 'UserProfileSettings'));
    screens.push(checkForModal(context, 'WorkOrderCreateUpdatePage'));
    screens.push(checkForModal(context, 'NotificationAddPage'));
    screens.push(checkForModal(context, 'WorkOrderOperationAddPage'));
    screens.push(checkForModal(context, 'SubOperationCreateUpdatePage'));
    screens.push(checkForModal(context, 'ReminderCreateUpdatePage'));
    screens.push(checkForModal(context, 'ErrorArchiveAndSync'));
    screens.push(checkForModal(context, 'FetchDocumentsPage'));
    screens.push(checkForModal(context, 'IssueOrReceiptCreateUpdatePage'));
    screens.push(checkForModal(context, 'InboundOutboundCreateUpdatePage'));
    screens.push(checkForModal(context, 'PhysicalInventoryCreateUpdatePage'));
    screens.push(checkForModal(context, 'CreatePurchaseRequisition'));

    return screens;
}
