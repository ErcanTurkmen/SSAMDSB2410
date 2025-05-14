import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';
import MeasuringPointsEDTNav from '../Points/EDT/MeasuringPointsEDTNav';

export default function MeasurementDocumentUpdateNav(context) {
    let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');

    if (libCommon.isCurrentReadLinkLocal(currentReadLink) || context.getClientData().FromErrorArchive) {
        libCommon.setStateVariable(context, 'TransactionType', 'UPDATE');

        if (context.getClientData().FromErrorArchive) {
            return NavToDocumentUpdatePageWhenError(context);
        }

        if (PersonalizationPreferences.isMeasuringPointListView(context)) {
            return context.executeAction('/SAPAssetManager/Actions/Measurements/MeasurementDocumentCreateUpdateNav.action');
        } else {
            context.getClientData().SingleReading = libCommon.getPageName(context) === 'MeasuringDocumentDetailsPage';
            return MeasuringPointsEDTNav(context);
        }
    }
}

function NavToDocumentUpdatePageWhenError(context) {
    if (!libVal.evalIsEmpty(context.binding.ErrorObject.RequestBody)) {
        let docNum = JSON.parse(context.binding.ErrorObject.RequestBody).MeasurementDocNum;

        if (!libVal.evalIsEmpty(docNum)) {
            if (PersonalizationPreferences.isMeasuringPointListView(context)) {
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeasurementDocuments', [], "$select=Point,MeasurementDocNum,CodeGroup,ReadingDate,ReadingTime,HasReadingValue,ReadingValue,UOM,ValuationCode,CodeShortText,ShortText,ReadBy,MeasuringPoint/PointDesc,MeasuringPoint/CharName,MeasuringPoint/CharDescription,MeasuringPoint/IsCounter,MeasuringPoint/UoM,MeasuringPoint/CodeGroup,MeasuringPoint/CatalogType,MeasuringPoint/CounterOverflow,MeasuringPoint/PrevReadingValue,MeasuringPoint/IsCounter,MeasuringPoint/IsCounterOverflow,MeasuringPoint/IsReverse,MeasuringPoint/IsLowerRange,MeasuringPoint/IsUpperRange,MeasuringPoint/IsCodeSufficient,MeasuringPoint/LowerRange,MeasuringPoint/UpperRange,MeasuringPoint/Decimal&$expand=MeasuringPoint&$filter=MeasurementDocNum eq '" + docNum + "'").then(results => {
                    if (results && results.getItem(0)) {
                        const data = results.getItem(0);
                        data.FromErrorArchive = true;
                        context.setActionBinding(data);
                    }
                    return context.executeAction('/SAPAssetManager/Actions/Measurements/MeasurementDocumentCreateUpdateNav.action');
                });
            } else {
                context.getClientData().SingleReading = libCommon.getPageName(context) === 'MeasuringDocumentDetailsPage';
                return MeasuringPointsEDTNav(context);
            }
        }
    }

    return Promise.resolve();
}
