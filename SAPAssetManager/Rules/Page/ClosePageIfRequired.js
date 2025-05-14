/**
* Call close page action based on NoNeedsNavBackAction client api param value
* @param {IClientAPI} clientAPI
*/
export default function ClosePageIfRequired(context) {
    const skipNavigation = context.getPageProxy().getClientData().NoNeedsNavBackAction;
    return skipNavigation ? true : context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
}
