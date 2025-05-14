import inspCharLib from './InspectionCharacteristics';
import {validateDependentCharacteristics} from './InspectionCharacteristicsOnExtensionLoadedEDT';
import InspectionCharacteristicsEDTLibrary from './InspectionCharacteristicsEDTLibrary';

export default async function InspectionCharacteristicsQualitativeOnChangeEDT(context) {
    let binding = context.binding;
    let valuationReadlink = '';
    let valuationStatus = '';
    let style = { FontColor: '76767b' };
    let enableNotificationButton = false;
    let valueAccepted = true;
    let isRemarkRequired = (binding.RemarksRequired === 'X')? true : false;
    let isRemarkRequiredOnRejection = (binding.RemarksRequiredOnRejection === 'X')? true : false;
    let clientAPI = context._control.getTable().context.clientAPI;
    if (inspCharLib.isQualitative(binding)) {
        let readLink = context._control.getValue();
        let valuationCell = context._control.getTable().getRowCellByName(context._control.getRow(), 'Valuation');
        let RemarksCell = context._control.getTable().getRowCellByName(context._control.getRow(), 'Remarks');
        RemarksCell.clearValidation();
        if (readLink) {
            valuationStatus = await context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], '').then(result => {
                if (result && result.getItem(0) && result.getItem(0).ValuationStatus) {
                    if (result.getItem(0).ValuationStatus === 'A') {
                        style = { FontColor: '107e3e' };
                        binding.Valuation = 'A';
                    } else if (result.getItem(0).ValuationStatus === 'R' || result.getItem(0).ValuationStatus === 'F' ) {
                        style =  { FontColor: 'bb0000' };
                        enableNotificationButton = true;
                        valueAccepted = false;
                        if (result.getItem(0).ValuationStatus === 'R') {
                            binding.Valuation = 'R';
                        } else {
                            binding.Valuation = 'F';
                        }

                    }
                }
                return result.getItem(0).ValuationStatus;
            });
            let comment = RemarksCell.getValue();
            if ((!comment && isRemarkRequired) || (!comment && isRemarkRequiredOnRejection && !valueAccepted)) {
                RemarksCell.applyValidation(clientAPI.localizeText('comment_is_mandatory')); 
            }
        } else {
            binding.Valuation = '';
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
