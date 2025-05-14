import inspCharLib from './InspectionCharacteristics';
import Logger from '../../Log/Logger';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default async function InspectionCharacteristicsTargetSpecification(context) {
    let binding = context.binding;
    let targetValueString = '';

    if (inspCharLib.isQuantitative(binding) || inspCharLib.isCalculatedAndQuantitative(binding)) {
        try {
            let uom = binding.UoM || '';
            if (!uom) {
                if (binding.MasterInspChar_Nav) {
                    uom = binding.MasterInspChar_Nav.UoM;
                }
            }

            let lowerLimit, upperLimit = '';
            let finalLowerLimit,finalUpperLimit = '';

            if (binding.LowerLimitFlag === '' && binding.UpperLimitFlag === '' && binding.MasterInspChar !== '') { //if both are empty and a linked measuring point exists then validate from measuring point's info
            
                let measuringPointArray = await context.read('/SAPAssetManager/Services/AssetManager.service', 'MeasuringPoints', [], `$filter=CharName eq '${binding.MasterInspChar}'&$top=1`);
                if (measuringPointArray.length > 0) {
                    let measuringPoint = measuringPointArray.getItem(0);
                    lowerLimit = measuringPoint.IsLowerRange === 'X' ? measuringPoint.LowerRange : '';
                    finalLowerLimit = context.formatNumber(lowerLimit, '', { maximumFractionDigits: context.binding.DecimalPlaces, minimumFractionDigits : 0 });
                    upperLimit = measuringPoint.IsUpperRange === 'X' ? measuringPoint.UpperRange : '';
                    finalUpperLimit = context.formatNumber(upperLimit, '', { maximumFractionDigits: context.binding.DecimalPlaces, minimumFractionDigits : 0 });
                }
            } else {
                lowerLimit = binding.LowerLimitFlag === 'X' ? binding.LowerLimit : '';

                finalLowerLimit = context.formatNumber(lowerLimit, '', { maximumFractionDigits: context.binding.DecimalPlaces, minimumFractionDigits : 0 });
                upperLimit = binding.UpperLimitFlag === 'X' ? binding.UpperLimit : '';
                finalUpperLimit = context.formatNumber(upperLimit, '', { maximumFractionDigits: context.binding.DecimalPlaces, minimumFractionDigits : 0 });
            }

            if (finalLowerLimit && finalUpperLimit) {
                targetValueString += `${finalLowerLimit} ${uom} < ${finalUpperLimit} ${uom}`;
            } else if (finalLowerLimit && ValidationLibrary.evalIsEmpty(finalUpperLimit)) {
                targetValueString += ` > ${finalLowerLimit} ${uom} `;
            } else if (ValidationLibrary.evalIsEmpty(finalLowerLimit) && finalUpperLimit) {
                targetValueString += ` < ${finalUpperLimit} ${uom} `;
            } 

            targetValueString += `(${context.localizeText('target_value')} ${context.formatNumber(binding.TargetValue, '', { maximumFractionDigits: context.binding.DecimalPlaces, minimumFractionDigits : 0 })})`;
            return targetValueString;
        } catch (err) {
            Logger.error(`Failed to populate the target spec: ${err}`);
            return '-';
        }
    }
    return '-';
}
