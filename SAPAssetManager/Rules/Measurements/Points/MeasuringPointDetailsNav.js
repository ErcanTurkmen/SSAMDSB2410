import Logger from '../../Log/Logger';
import libVal from '../../Common/Library/ValidationLibrary';

export default function MeasuringPointDetailsNav(context) {
    let readLink = context.binding['@odata.readLink'];
    let pageProxy = context.getPageProxy();
    let actionContext = pageProxy.getActionBinding();
    let query = '$expand=MeasurementDocs,WorkOrderTool&$select=*,Point,PointDesc,CharName,UoM,IsCounter,CodeGroup,CatalogType,MeasurementDocs/ReadingDate,MeasurementDocs/ReadingTime,MeasurementDocs/ReadingValue,MeasurementDocs/IsCounterReading,MeasurementDocs/CounterReadingDifference,MeasurementDocs/MeasurementDocNum,MeasurementDocs/CodeGroup';
    if (readLink && readLink.indexOf('MyWorkOrderOperations') !== -1) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', actionContext['@odata.readLink'] + '/PRTPoint', [], query).then(Result => {
            const entity = processEntity(Result.getItem(0), actionContext);
            pageProxy.setActionBinding(entity);
            /**Navagation to a different detail pages if val code only*/
            if (!libVal.evalIsEmpty(entity.CodeGroup)) {
                if (libVal.evalIsEmpty(entity.CharName)) {
                    return pageProxy.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointDetailsValCodeNav.action');
                }
                return pageProxy.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointDetailsNav.action');
            }
            return pageProxy.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointDetailsNav.action');
        }, error => {
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMeasuringPoints.global').getValue(), error);
        });
    } 
    //Rebind the necessary point record data selected from the list
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionContext['@odata.readLink'], [], query).then(Result => {
        const entity = processEntity(Result.getItem(0), actionContext);
        pageProxy.setActionBinding(entity);
         /**Navagation to a different detail pages if val code only*/
        if (!libVal.evalIsEmpty(entity.CodeGroup)) {
            if (libVal.evalIsEmpty(entity.CharName)) {
                return pageProxy.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointDetailsValCodeNav.action');
            }
            return pageProxy.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointDetailsNav.action');
        }
        return pageProxy.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointDetailsNav.action');
    }, error => {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMeasuringPoints.global').getValue(), error);
    });
}

export function processEntity(entity, context) {
    if (context && context.disableReading) {
        entity.disableReading = true;
    }
    return entity;
}
