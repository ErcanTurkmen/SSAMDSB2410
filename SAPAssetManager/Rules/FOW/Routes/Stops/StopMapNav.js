import {GetStopOnlyGeometryInformation} from './StopGeometryInformation';

export default function StopMapNav(context) {
    const pageProxy = context.getPageProxy();
    const binding = pageProxy.binding || context.binding;
    const mapData = binding.mapData;
    return GetStopOnlyGeometryInformation(context).then(function(stop) {
        if (Object.keys(stop).length > 0) {
            mapData.push(stop);
        }
        pageProxy.setActionBinding(mapData);
        return context.executeAction('/SAPAssetManager/Actions/FOW/Routes/Stops/StopMapNav.action');
    });
}
