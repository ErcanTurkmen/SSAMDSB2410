import CachePriorityDescr from './CachePriorityDescr';

/** @param {IControlProxy} context  */
export default function GetPriorityDescription(context, priority) {
    const clientData = (context.getPageProxy?.() || context.evaluateTargetPathForAPI(`#Page:${context.currentPage.definition.name}`)).getClientData();  // invoked from map, context is IClientAPI: does not have getPageProxy
    clientData.priorityCacheInProgress = clientData.priorityCacheInProgress ? clientData.priorityCacheInProgress : CachePriorityDescr(context, clientData);  // we are using this promise as a poor man's semaphore to make sure we actually do the caching only once
    return clientData.priorityCacheInProgress.then(() => {
        /** @type {Priority} */
        const priorityObj = clientData.Priorities[priority];
        return priorityObj && priorityObj.PriorityDescription || '';
    });
}
