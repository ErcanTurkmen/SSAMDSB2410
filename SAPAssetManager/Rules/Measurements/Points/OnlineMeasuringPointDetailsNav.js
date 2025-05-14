import libVal from '../../Common/Library/ValidationLibrary';

export default function OnlineMeasuringPointDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    let actionContext = pageProxy.getActionBinding();
    let action = '/SAPAssetManager/Actions/Measurements/OnlineMeasuringPointDetailsNav.action';

    /**Navigation to a different detail pages if val code only*/
    if (!libVal.evalIsEmpty(actionContext.CodeGroup)) {
        if (libVal.evalIsEmpty(actionContext.CharName)) {
            action = '/SAPAssetManager/Actions/Measurements/OnlineMeasuringPointDetailsValCodeNav.action';
        }
    }
    return pageProxy.executeAction(action);
}
