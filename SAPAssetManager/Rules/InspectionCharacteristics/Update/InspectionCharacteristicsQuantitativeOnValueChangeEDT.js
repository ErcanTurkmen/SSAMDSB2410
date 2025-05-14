import inspCharLib from './InspectionCharacteristics';
import InspectionCharacteristicsLinkedMeasuringPointValidationEDT from './InspectionCharacteristicsLinkedMeasuringPointValidationEDT';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import {validateDependentCharacteristics} from './InspectionCharacteristicsOnExtensionLoadedEDT';
import InspectionCharacteristicsEDTLibrary from './InspectionCharacteristicsEDTLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default async function InspectionCharacteristicsQuantitativeOnValueChangeEDT(context) {

    let binding = context.binding;
    context._control.clearValidation();
    let clientAPI = context._control.getTable().context.clientAPI;
    if (inspCharLib.isQuantitative(binding)) {
        let quantitativeControl = context._control;
        let value = context.getValue();
        let valuationStatus = '';
        let message = '';
        let style = { FontColor: '76767b' };
        let enableNotificationButton = false;
        let valueAccepted = true;
        let valuationReadlink = '';
        let isRemarkRequired = (binding.RemarksRequired === 'X')? true : false;
        let isRemarkRequiredOnRejection = (binding.RemarksRequiredOnRejection === 'X')? true : false;
        let valuationCell = context._control.getTable().getRowCellByName(context._control.getRow(), 'Valuation');
        valuationCell.clearValidation();
        let RemarksCell = context._control.getTable().getRowCellByName(context._control.getRow(), 'Remarks');
        RemarksCell.clearValidation();
        if (value) {
            value = parseFloat(value);
            if ((binding.LowerLimitFlag === 'X' && value < binding.LowerLimit) || 
                (binding.UpperLimitFlag === 'X' && value > binding.UpperLimit)) {
                valueAccepted = false;
                binding.Valuation = 'R';
                style =  { FontColor: 'bb0000' };
                enableNotificationButton = true;
            } else {
                binding.Valuation = 'A';
                style = { FontColor: '107e3e' };
            }

            if (valueAccepted && binding.CharId !== '' && binding.CharId !== '0000000000') { //if a linked measuring point exists then validate from measuring point's info
                let linkedMeasuringPoint = await inspCharLib.getLinkedMeasuringPoint(clientAPI, binding);
                if (linkedMeasuringPoint) {
                    await InspectionCharacteristicsLinkedMeasuringPointValidationEDT(clientAPI, linkedMeasuringPoint, quantitativeControl).then((result) => {
                        if (result) {
                            message += result.Message;
                            if (result.Type === 'w') {
                                valueAccepted = false;
                                valuationStatus = binding.Valuation = 'R';
                                style = { FontColor: 'bb0000' };
                            } else {
                                valueAccepted = false;
                                binding.Valuation = 'R';
                                enableNotificationButton = true;
                                style =  { FontColor: 'bb0000' };
                            }
                        }
                    }).catch(() => {
                        return false;
                    });
                }
            }
            valuationStatus = binding.Valuation;
        } else {
            binding.Valuation = '';
        }
        await inspCharLib.calulateCharsEDT(context, context._control.getTable());

        quantitativeControl.clearValidation();
        if (message) {
            quantitativeControl.applyValidation(message);
        }
        let comment = RemarksCell.getValue();
        if ((!comment && isRemarkRequired) || (!comment && isRemarkRequiredOnRejection && !valueAccepted)) {
            RemarksCell.applyValidation(CommonLibrary.addNewLineAfterSentences(message + ' ' + clientAPI.localizeText('comment_is_mandatory')));
        }

        valuationReadlink = `InspectionResultValuations('${valuationStatus}')`;
        let valuation = await context.read('/SAPAssetManager/Services/AssetManager.service', valuationReadlink, [], '').then(valuationResult => {
            if (valuationResult && valuationResult.getItem(0)) {
                return valuationResult.getItem(0).ShortText;
            }
            return '';
        });
        valuationCell.clearValidation();
        valuationCell.setValue(valuation);
        if (style) {
            valuationCell.setStyle(style);
        }
        let notificationCell = context._control.getTable().getRowCellByName(context._control.getRow(), 'Notification');
        notificationCell.setEditable(enableNotificationButton);

        validateDependentCharacteristics(context._control.getTable(), context.binding, true);
        let statusText = inspCharLib.checkEDTReadingCounts(context, context._control.getTable());
        InspectionCharacteristicsEDTLibrary.findHeaderSection(clientAPI, context._control.getTable()).setStatusText(statusText);
    }
}
