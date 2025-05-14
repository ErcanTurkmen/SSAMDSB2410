import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

export default async function OnlineMeasuringPointsTarget(clientAPI) {
    try {
        clientAPI.showActivityIndicator();
        const isFromEquipmentPage = libCom.getPageName(clientAPI.getPageProxy()) === 'OnlineEquipmentDetailsPage';
        const isFromFlocPage = libCom.getPageName(clientAPI.getPageProxy()) === 'OnlineFunctionalLocationDetails';

        const top3 = isFromEquipmentPage || isFromFlocPage ? '$top=3&' : '';
        const binding = clientAPI.getPageProxy().binding;
        const filter = binding.EquipId ? `$filter=EquipId eq '${binding.EquipId}'` : `$filter=FuncLocIdIntern eq '${binding.FuncLocIdIntern}'`;
        let measuringPoints = await clientAPI.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'MeasuringPoints', [], `${top3}${filter}`);
        if (libCom.isDefined(measuringPoints)) {
            let result = [];
            let pointsQueryString = [];
            for (let i = 0; i < measuringPoints.length; i++) {
                const point = measuringPoints.getItem(i);
                point.MeasurementDocs = [];
                pointsQueryString.push(`Point eq '${point.Point}'`);
                result.push(point);
            }
            const measurementDocs = await clientAPI.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'MeasurementDocuments', [], `$filter=${pointsQueryString.join(' or ')}`);
            measurementDocs._array.forEach(doc => {
                const idx = result.findIndex(mp => mp.Point === doc.Point);
                if (idx !== -1) {
                    result[idx].MeasurementDocs.push(doc);
                }
            });
            return result;
        }
        return [];
    } catch (err) {
        Logger.error('OnlineMeasuringPointsTarget', err);
        return [];
    } finally {
        clientAPI.dismissActivityIndicator();
    }
}
