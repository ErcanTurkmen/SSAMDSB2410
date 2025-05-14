import inspCharLib from './InspectionCharacteristics';
import MyButtonLib from '../../../Extensions/ButtonStackModule/ButtonStackLibrary';
import deviceType from '../../Common/DeviceType';
import InspectionCharacteristicsLinkedMeasuringPointValidation from './InspectionCharacteristicsLinkedMeasuringPointValidation';
import {FDCSectionHelper} from '../../FDC/DynamicPageGenerator';
import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import IsWindows from '../../Common/IsWindows';
import FDCSetEditable from '../FDCSetEditable';
import FDCSetTitle from '../FDCSetTitle';

export default async function InspectionCharacteristicsOnValidateOrCalculate(context) {

    let binding = context.getActionResult('ReadResult').data.getItem(0);
    let fdcHelper = new FDCSectionHelper(context);
    let section = fdcHelper.findSection(context);
    let index = fdcHelper.findSectionWithbinding(binding);
    if (index !== -1) {
        let valuationControl = 'Valuation';
        let valueControl = 'QuantitativeValue';
        let defectExtensionName;
        let validateButtonName;
        let recordDefectsButtonName;

        if (deviceType(context) === 'Tablet') {
            defectExtensionName = 'MyExtensionControlName';
            validateButtonName = 'ValidateOrCalculateButtonTablet';
            recordDefectsButtonName = 'RecordDefectsButtonTablet';
        } else {
            defectExtensionName = 'MyExtensionControlNameRecordDefect';
            validateButtonName = 'ValidateOrCalculateButton';
            recordDefectsButtonName = 'RecordDefectsButton';
        }
        let defectButtonStack = defectExtensionName;
        let defectContext = IsWindows(context) ? '': context.getPageProxy().getControls()[0].sections[index].getControl(defectButtonStack).getExtension().context.clientAPI;
        
        if (inspCharLib.isCalculatedAndQuantitative(binding)) {
            if (inspCharLib.isCalculatedAndQuantitative(binding)) {
                return inspCharLib.calulateFormula(context, binding).then(async (result) => {
                    let value = parseFloat(result);
                    let valueAccepted = true;
                    if (binding.LowerLimitFlag === 'X' && value <= binding.LowerLimit) {
                        valueAccepted = false;
                    }
                    if (binding.UpperLimitFlag === 'X' && value >= binding.UpperLimit) {
                        valueAccepted = false;
                    }
                    if (valueAccepted) {
                        binding.Valuation='A';
                        if (inspCharLib.isManualDefectRecordingEnable(context)) {
                            FDCSetEditable(context,defectContext,MyButtonLib,recordDefectsButtonName, context.getPageProxy().getControls()[0].sections[index],false);
                        }
                    } else {
                        binding.Valuation='R';
                        if (inspCharLib.isManualDefectRecordingEnable(context)) {
                            FDCSetEditable(context,defectContext,MyButtonLib,recordDefectsButtonName, context.getPageProxy().getControls()[0].sections[index],true); 
                        }
                    }

                    let valCtrl = context.getPageProxy().getControls()[0].sections[index].getControl(valuationControl);
                    let valCtrlSpecifier = valCtrl.getTargetSpecifier();
                    valCtrlSpecifier.setQueryOptions("$filter=Valuation eq '" + binding.Valuation + "'");
                    valCtrl.setTargetSpecifier(valCtrlSpecifier);
                    valCtrl.setValue("InspectionResultValuations('" + binding.Valuation + "')");

                    context.getPageProxy().getControls()[0].sections[index].getControl(valueControl).setValue(value);
                    FDCSetTitle(context, context, MyButtonLib,validateButtonName,section, context.localizeText('calculated'));
                    FDCSetEditable(context, context, MyButtonLib,validateButtonName,section,true);
                    if (binding.RequiredChar === 'X') {
                        const sectionBindings = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings;
                        await inspCharLib.enableDependentCharacteristics(context, binding, sectionBindings);
                    }
                }).catch(() => {
                    return Promise.resolve();
                });
            }
        }
        if (inspCharLib.isQuantitative(binding)) {
            let quantitativeControl = context.getPageProxy().getControls()[0].sections[index].getControl(valueControl);
            let value = '';
            let valueAccepted = true;
            if (libVal.evalIsEmpty(quantitativeControl.getValue())) {
                libCom.executeInlineControlError(context, quantitativeControl, context.localizeText('field_is_required'));
                return false;
            }
            if (!libLocal.isNumber(context,quantitativeControl.getValue())) {
                libCom.executeInlineControlError(context, quantitativeControl, context.localizeText('validation_reading_is_numeric'));
                return false;
            }
            if (!libVal.evalIsEmpty(quantitativeControl.getValue())) {
                value = parseFloat(quantitativeControl.getValue());

                if (binding.LowerLimitFlag === 'X' && value < binding.LowerLimit) {
                    valueAccepted = false;
                }
                if (binding.UpperLimitFlag === 'X' && value > binding.UpperLimit) {
                    valueAccepted = false;
                }

                if (valueAccepted && binding.CharId !== '' && binding.CharId !== '0000000000') { //if a linked measuring point exists then validate from measuring point's info
                
                    let linkedMeasuringPoint = await inspCharLib.getLinkedMeasuringPoint(context, binding);
                    if (linkedMeasuringPoint) {
                        valueAccepted = await InspectionCharacteristicsLinkedMeasuringPointValidation(context, linkedMeasuringPoint, quantitativeControl).then((accepted) => {
                            return accepted;
                        }).catch(() => {
                            return false;
                        });
                    }
                }
            } 

            if (valueAccepted) {
                binding.Valuation = 'A';
                if (inspCharLib.isManualDefectRecordingEnable(context)) {
                    FDCSetEditable(context, defectContext, MyButtonLib, recordDefectsButtonName,context.getPageProxy().getControls()[0].sections[index],false);
                }
            } else {
                binding.Valuation = 'R';
                if (inspCharLib.isManualDefectRecordingEnable(context)) {
                    FDCSetEditable(context, defectContext, MyButtonLib, recordDefectsButtonName,context.getPageProxy().getControls()[0].sections[index],true);
                }
            }

            let valCtrl = context.getPageProxy().getControls()[0].sections[index].getControl(valuationControl);
            let valCtrlSpecifier = valCtrl.getTargetSpecifier();
            valCtrlSpecifier.setQueryOptions("$filter=Valuation eq '" + binding.Valuation + "'");
            valCtrl.setTargetSpecifier(valCtrlSpecifier);
            valCtrl.setValue("InspectionResultValuations('" + binding.Valuation + "')");
            FDCSetEditable(context, defectContext, MyButtonLib, validateButtonName,context.getPageProxy().getControls()[0].sections[index],false);
            FDCSetTitle(context, defectContext, MyButtonLib,validateButtonName,context.getPageProxy().getControls()[0].sections[index], context.localizeText('calculated'));
            if (binding.RequiredChar === 'X') {
                const sectionBindings = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings;
                await inspCharLib.enableDependentCharacteristics(context, binding, sectionBindings);
            }
        }
    }
}
