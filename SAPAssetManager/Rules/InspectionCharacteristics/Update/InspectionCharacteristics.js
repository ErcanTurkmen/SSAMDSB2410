import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libThis from './InspectionCharacteristics';
import libVal from '../../Common/Library/ValidationLibrary';
import MyButtonLib from '../../../Extensions/ButtonStackModule/ButtonStackLibrary';
import deviceType from '../../Common/DeviceType';
import enableMaintenanceTechnician from '../../SideDrawer/EnableMaintenanceTechnician';
import { evaluateExpression } from '../../Common/Library/Evaluate';
import InspectionCharacteristicsLinkedMeasuringPointValidation from './InspectionCharacteristicsLinkedMeasuringPointValidation';
import InspectionCharacteristicsLinkedMeasuringPointValidationEDT from './InspectionCharacteristicsLinkedMeasuringPointValidationEDT';
import { FDCSectionHelper } from '../../FDC/DynamicPageGenerator';
import { InspectionValuationVar } from '../../Common/Library/GlobalInspectionResults';
import { validateDependentCharacteristics } from './InspectionCharacteristicsOnExtensionLoadedEDT';
import InspectionCharacteristicsEDTLibrary from './InspectionCharacteristicsEDTLibrary';
import isWindows from '../../Common/IsWindows';
import FDCSetEditable from '../FDCSetEditable';
import FDCSetTitle from '../FDCSetTitle';

export default class {
    /*
    * determines if characteristic is required
    */
    static isRequired(binding) {
        return (binding.RequiredChar === 'X');
    }

    /*
    * determines if characteristic is of type quantitative
    */
    static isQuantitative(binding) {
        return ((binding.QuantitativeFlag === 'X' && binding.CalculatedCharFlag === '') || (binding.QuantitativeFlag === 'X' && binding.CalculatedCharFlag !== '' && binding.Formula1 === ''));
    }

    /**
    * determines if characteristic is of type qualitative
    */
    static isQualitative(binding) {
        return (binding.QuantitativeFlag === '' && binding.CalculatedCharFlag === '');
    }

    /**
    * determines if characteristic is of type calculated
    */
    static isCalculatedAndQuantitative(binding) {
        return (binding.QuantitativeFlag === 'X' && binding.CalculatedCharFlag === 'X');
    }

    /**
    * determines if the formula is a target value
    */
    static isCalculatedTargetValue(formula) {
        return (formula.startsWith('C7') || formula.startsWith('c7'));
    }

    /**
    * determines if the formula is a input value
    */
    static isCalculatedInputValue(formula) {
        return (formula.startsWith('C0') || formula.startsWith('c0'));
    }

    /**
    * determines if flag ManualDefectRecording is enable or not
    */
    static isManualDefectRecordingEnable(context) {
        if (enableMaintenanceTechnician(context)) {
            return (libCom.getAppParam(context, 'EAM_CHECKLIST', 'ManualDefectRecording') === 'Y');
        }
        return false;
    }

    /**
    * searchString replaced with padString in the formula
    */
    static padInspectionChar(formula, searchString, padString) {
        // Use a regular expression to replace the search string with padded string
        const regex = new RegExp(searchString, 'g');
        return formula.replace(regex, padString);
    }

    /**
    * calculate the formula ((CD0004+CE0050)*2)+DE0050)  = ((30+20)*2)+50)
    * CD0004
    * CD
    * 0004
    */
    static calulateFormula(context, binding) {
        try {
            if (binding.Formula1) {
                let formula = binding.Formula1;
                if (binding.Formula2) {
                    formula += binding.Formula2;
                }
                //Check for characteristics length in formula
                let split1 = formula.match(/([A-Z0-9]{2})(\d{2,4})/g);
                let split2 = formula.match(/([A-Z0-9]{2})(\d{4})/g);
                if ((split1?.length ?? 0) === (split2?.length ?? 0)) {
                    Logger.info('calulateFormula', 'Inspection Characteristics are of length 4');
                } else {
                    Logger.info('calulateFormula', 'Initial Formula : ' + formula);
                    Logger.info('calulateFormula', 'Do characteristics padding');
                    for (const splitValues of split1) {
                        const values = splitValues.match(/([A-Z0-9]{2})(\d{2,4})/);
                        const [codeValue, appParamName, itemValue] = values;
                        if (isNaN(codeValue) && itemValue.length < 4) {
                            //Find and replace Inspection Characteristics in the formula to match length 4
                            formula = libThis.padInspectionChar(formula, codeValue, appParamName+itemValue.padStart(4, '0'));
                        }
                    }
                    Logger.info('calulateFormula', 'Padded Formula : ' + formula);
                }

                let split = formula.match(/([A-Z0-9]{2})(\d{4})/g);
                let codes = [];
                let reads = [];
                for (const splitValues of split) {
                    const values = splitValues.match(/([A-Z0-9]{2})(\d{4})/);
                    const [codeValue, appParamName, itemValue] = values;
                    const property = libCom.getAppParam(context, 'QMFORMULA', appParamName);
                    codes.push({
                        'Code': codeValue,
                        'Item': itemValue,
                        'Property': property,
                    });
                }
                let charFound = false;
                let foundError = false;
                let calculateFormula = formula;
                for (const code of codes) {
                    //find the characteristic on the FDC screen
                    let sectionBindings = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings;
                    if (sectionBindings && sectionBindings.length > 0) {
                        for (let i = 0; i < sectionBindings.length; i++) {
                            let sectionBinding = sectionBindings[i];
                            let odataType = sectionBinding['@odata.type'];
                            if (odataType === '#sap_mobile.InspectionCharacteristic') {
                                let entity = `InspectionCharacteristics(InspectionChar='${code.Item}',SampleNum='${binding.SampleNum}',InspectionLot='${binding.InspectionLot}',InspectionNode='${binding.InspectionNode}')`;
                                let sectionReadLink = sectionBinding['@odata.readLink'];
                                if (entity === sectionReadLink) {
                                    charFound = true;
                                    let valueControl = 'QuantitativeValue';
                                    let extensionName;
                                    let validateButtonName;

                                    if (deviceType(context) === 'Tablet') {
                                        extensionName = 'MyExtensionControlName';
                                        validateButtonName = 'ValidateOrCalculateButtonTablet';
                                    } else {
                                        extensionName = 'MyExtensionControlNameValidate';
                                        validateButtonName = 'ValidateOrCalculateButton';
                                    }

                                    let buttonStack = extensionName;
                                    let contextProxy = isWindows(context) ? '' : context.getPageProxy().getControls()[0].sections[i].getControl(buttonStack).getExtension().context.clientAPI;
                                    let value = parseFloat(context.getPageProxy().getControls()[0].sections[i].getControl(valueControl).getValue());
                                    if (libVal.evalIsEmpty(value) || isNaN(value)) {
                                        libCom.setInlineControlErrorVisibility(context.getPageProxy().getControls()[0].sections[i].getControl(valueControl), false);
                                        context.getPageProxy().getControls()[0].sections[i].getControl(valueControl).clearValidation();
                                        libCom.setInlineControlError(context, context.getPageProxy().getControls()[0].sections[i].getControl(valueControl), context.localizeText('field_is_required'));
                                        context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getControl('FormCellContainer').redraw();
                                        foundError = true;
                                    } else {
                                        context.getPageProxy().getControls()[0].sections[i].getControl(valueControl).clearValidation();
                                        context.getPageProxy().getControl('FormCellContainer').redraw();
                                        FDCSetEditable(context, contextProxy, MyButtonLib, validateButtonName, context.getPageProxy().getControls()[0].sections[i], true);
                                        calculateFormula = calculateFormula.replace(code.Code, value);
                                    }
                                }
                            }
                        }
                    }
                    if (!charFound) {
                        reads.push(this.read(context, code));
                    }
                }
                if (!charFound) {
                    return Promise.all(reads).then((results) => {
                        let formulaexp = formula;
                        for (let k = 0; k < codes.length; k++) {
                            formulaexp = formulaexp.replace(codes[k].Code, results[k]);
                        }
                        return evaluateExpression(formulaexp);
                    }).catch(() => {
                        return Promise.resolve(0);
                    });
                }
                if (!foundError) {
                    return Promise.resolve(evaluateExpression(calculateFormula));
                }
            }
        } catch (error) {
            Logger.info('calulateFormula - formula - ' + context.binding.Formula1 + ' ,error - ' + error);
        }
        return Promise.resolve(0);
    }

    /**
    * calculate the formula ((CD0004+CE0050)*2)+DE0050)  = ((30+20)*2)+50)
    * CD0004
    * CD
    * 0004
    */
    static calulateFormulaEDT(context, binding, extension) {
        let clientAPI;
        if (extension) {
            clientAPI = extension.context.clientAPI;
        } else {
            clientAPI = context._control.getTable().context.clientAPI;
            extension = context._control.getTable();
        }
        try {
            if (binding.Formula1) {
                let formula = binding.Formula1;
                if (binding.Formula2) {
                    formula += binding.Formula2;
                }
                //Check for characteristics length in formula
                let split1 = formula.match(/([A-Z0-9]{2})(\d{2,4})/g);
                let split2 = formula.match(/([A-Z0-9]{2})(\d{4})/g);
                if ((split1?.length ?? 0) === (split2?.length ?? 0)) {
                    Logger.info('calulateFormulaEDT', 'Inspection Characteristics are of length 4');
                } else {
                    Logger.info('calulateFormulaEDT', 'Initial Formula : ' + formula);
                    Logger.info('calulateFormulaEDT', 'Do characteristics padding');
                    for (const splitValues of split1) {
                        const values = splitValues.match(/([A-Z0-9]{2})(\d{2,4})/);
                        const [codeValue, appParamName, itemValue] = values;
                        if (isNaN(codeValue) && itemValue.length < 4) {
                            //Find and replace Inspection Characteristics in the formula to match length 4
                            formula = libThis.padInspectionChar(formula, codeValue, appParamName+itemValue.padStart(4, '0'));
                        }
                    }
                    Logger.info('calulateFormulaEDT', 'Padded Formula : ' + formula);
                }

                let split = formula.match(/([A-Z0-9]{2})(\d{4})/g);
                let codes = [];
                let reads = [];
                for (const splitValues of split) {
                    const values = splitValues.match(/([A-Z0-9]{2})(\d{4})/);
                    const [codeValue, appParamName, itemValue] = values;
                    const property = libCom.getAppParam(clientAPI, 'QMFORMULA', appParamName);
                    codes.push({
                        'Code': codeValue,
                        'Item': itemValue,
                        'Property': property,
                    });
                }
                let charFound = false;
                let foundError = false;
                let calculateFormula = formula;
                let evaluateFormula = true;
                for (const code of codes) {
                    let rowBindings = extension.getRowBindings();
                    if (rowBindings && rowBindings.length > 0) {
                        for (let i = 0; i < rowBindings.length; i++) {
                            let rowBinding = rowBindings[i];
                            let odataType = rowBinding['@odata.type'];
                            if (odataType === '#sap_mobile.InspectionCharacteristic') {
                                let inspectionChar = `InspectionChar='${code.Item}'`;
                                let rowBindingReadLink = rowBinding['@odata.readLink'];
                                if (rowBindingReadLink.includes(inspectionChar)) {
                                    charFound = true;
                                    let quantitativeCell = extension.getRowCellByName(i, 'Quantitive');
                                    if (quantitativeCell.getValue()) {
                                        calculateFormula = calculateFormula.replace(code.Code, quantitativeCell.getValue());
                                    } else {
                                        evaluateFormula = false;
                                    }
                                }
                            }
                        }
                    }
                    if (!charFound) {
                        reads.push(this.read(context, code));
                    }
                }
                if (!charFound) {
                    return Promise.all(reads).then((results) => {
                        let formulaexp = formula;
                        for (let k = 0; k < codes.length; k++) {
                            formulaexp = formulaexp.replace(codes[k].Code, results[k]);
                        }
                        return evaluateExpression(formulaexp);
                    }).catch(() => {
                        return Promise.resolve(0);
                    });
                }
                if (!foundError) {
                    if (evaluateFormula) {
                        return Promise.resolve(evaluateExpression(calculateFormula));
                    } else {
                        return Promise.resolve(calculateFormula);
                    }
                }
            }
        } catch (error) {
            Logger.info('calulateFormula - formula - ' + context.binding.Formula1 + ' ,error - ' + error);
        }
        return Promise.resolve(0);
    }

    static async calulateCharsEDT(context, extension) {
        let calculateChars = extension._props.definition.data.ExtensionProperties.UserData.CalulateChars;
        for (const calculateCharObj of calculateChars) {
            let binding = calculateCharObj.rowBinding;
            let rowIndex = calculateCharObj.rowIndex;
            let value = await this.calulateFormulaEDT(context, binding, extension);
            if (!Number.isNaN(parseFloat(value))) {
                let clientAPI = extension.context.clientAPI;
                let valuationStatus = '';
                let message = '';
                let style = { FontColor: '76767b' };
                let enableNotificationButton = false;
                let valueAccepted = true;
                let valuationReadlink = '';
                let isRemarkRequired = (binding.RemarksRequired === 'X') ? true : false;
                let isRemarkRequiredOnRejection = (binding.RemarksRequiredOnRejection === 'X') ? true : false;
                let calculateControl = extension.getRowCellByName(rowIndex, 'Calculate');
                calculateControl.setValue(value.toString());
                let valuationCell = extension.getRowCellByName(rowIndex, 'Valuation');
                valuationCell.clearValidation();
                let RemarksCell = extension.getRowCellByName(rowIndex, 'Remarks');
                RemarksCell.clearValidation();
                if ((binding.LowerLimitFlag === 'X' && value < binding.LowerLimit) ||
                    (binding.UpperLimitFlag === 'X' && value > binding.UpperLimit)) {
                    valueAccepted = false;
                    binding.Valuation = 'R';
                    style = { FontColor: 'bb0000' };
                    enableNotificationButton = true;
                } else {
                    binding.Valuation = 'A';
                    style = { FontColor: '107e3e' };
                }

                if (valueAccepted && binding.CharId !== '' && binding.CharId !== '0000000000') { //if a linked measuring point exists then validate from measuring point's info
                    let linkedMeasuringPoint = await this.getLinkedMeasuringPoint(clientAPI, binding);
                    if (linkedMeasuringPoint) {
                        await InspectionCharacteristicsLinkedMeasuringPointValidationEDT(clientAPI, linkedMeasuringPoint, value).then((result) => {
                            if (result) {
                                if (result.Type === 'w') {
                                    valueAccepted = false;
                                    valuationStatus = binding.Valuation = 'R';
                                    style = { FontColor: 'bb0000' };
                                } else {
                                    binding.Valuation = 'R';
                                    enableNotificationButton = true;
                                    style = { FontColor: 'bb0000' };
                                }
                                message += result.Message;
                            }
                        }).catch(() => {
                            return false;
                        });
                    }
                }
                valuationStatus = binding.Valuation;

                calculateControl.clearValidation();
                if (message) {
                    calculateControl.applyValidation(message);
                }
                
                let notificationCell = extension.getRowCellByName(rowIndex, 'Notification');
                notificationCell.setEditable(enableNotificationButton);

                let comment = RemarksCell.getValue();
                if ((!comment && isRemarkRequired) || (!comment && isRemarkRequiredOnRejection && !valueAccepted)) {
                    RemarksCell.applyValidation(libCom.addNewLineAfterSentences(message + ' ' + clientAPI.localizeText('comment_is_mandatory')));
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
                validateDependentCharacteristics(extension, binding);
                let statusText = this.checkEDTReadingCounts(context, extension);
                InspectionCharacteristicsEDTLibrary.findHeaderSection(clientAPI, extension).setStatusText(statusText);
            }
        }
    }

    static read(context, code) {
        let entity = `InspectionCharacteristics(InspectionLot='${context.binding.InspectionLot}',InspectionNode='${context.binding.InspectionNode}',InspectionChar='${code.Item}',SampleNum='${context.binding.SampleNum}')`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], '').then(result => {
            if (result && result.length > 0) {
                let row = result.getItem(0);
                if (Object.prototype.hasOwnProperty.call(row, code.Property)) {
                    return row[code.Property];
                }
                return 0;
            }
            return 0;
        }).catch(() => {
            return 0;
        });
    }

    static async validateAllCharacteristics(context) {
        let rejectedChars = [];
        let sections = context.getPageProxy().getControls()[0].sections;
        let sectionBindings = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings;
        if (sections && sections.length > 0) {
            for (let i = 0; i < sections.length; i++) {
                let section = sections[i];
                let odataType = sectionBindings[i]['@odata.type'];
                if (odataType === '#sap_mobile.InspectionCharacteristic') {
                    await libThis.validateCharacteristic(context, sectionBindings[i], section, i);
                    if (!libVal.evalIsEmpty(sectionBindings[i].Valuation) && sectionBindings[i].Valuation === 'R') {
                        sectionBindings[i].UniqueId = `${sectionBindings[i].InspectionLot}-${sectionBindings[i].InspectionNode}-${sectionBindings[i].InspectionChar}-${sectionBindings[i].SampleNum}`; //need this to identify the characteristic
                        rejectedChars.push(sectionBindings[i].UniqueId);
                    }
                }
            }
        }
        context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().RejectedChars = rejectedChars;
    }

    static async validateCharacteristic(context, sectionBinding, section, index) {
        if (libThis.isQuantitative(sectionBinding)) {
            await this.setCharacteristicValuation(context, sectionBinding, section, section.getControl('QuantitativeValue'), index);
        }
    }

    static async setCharacteristicValuation(context, sectionBinding, section, quantitativeControl, index) {
        let valuationControl = 'Valuation';
        let validateExtensionName;
        let defectExtensionName;
        let validateButtonName;
        let recordDefectsButtonName;
        let value = quantitativeControl.getValue();
        let valueAccepted = true;
        if (!libVal.evalIsEmpty(value)) {
            value = parseFloat(value);
        }

        if (deviceType(context) === 'Tablet') {
            validateExtensionName = defectExtensionName = 'MyExtensionControlName';
            validateButtonName = 'ValidateOrCalculateButtonTablet';
            recordDefectsButtonName = 'RecordDefectsButtonTablet';
        } else {
            validateExtensionName = 'MyExtensionControlNameValidate';
            defectExtensionName = 'MyExtensionControlNameRecordDefect';
            validateButtonName = 'ValidateOrCalculateButton';
            recordDefectsButtonName = 'RecordDefectsButton';
        }

        let validateButtonStack = validateExtensionName;
        let validateContextProxy = isWindows(context) ? '' : context.getPageProxy().getControls()[0].sections[index].getControl(validateButtonStack).getExtension().context.clientAPI;
        if (libVal.evalIsEmpty(quantitativeControl.getValue())) {
            return this.setInlineError(context, quantitativeControl, context.localizeText('field_is_required'));
        }
        if (!libLocal.isNumber(context, quantitativeControl.getValue())) {
            return this.setInlineError(context, quantitativeControl, context.localizeText('validation_reading_is_numeric'));
        }

        let defectButtonStack = defectExtensionName;
        let defectContextProxy = isWindows(context) ? '' : context.getPageProxy().getControls()[0].sections[index].getControl(defectButtonStack).getExtension().context._clientAPI;
        if (!libVal.evalIsEmpty(value)) { //For the purposes of the filter, only validate if user entered a value

            if (sectionBinding.LowerLimitFlag === 'X' && value < sectionBinding.LowerLimit) {
                valueAccepted = false;
            }

            if (valueAccepted && sectionBinding.UpperLimitFlag === 'X') {
                if (sectionBinding.UpperLimit > value) {
                    valueAccepted = true;
                } else {
                    valueAccepted = false;
                }
            }

            if (valueAccepted && sectionBinding.CharId !== '' && sectionBinding.CharId !== '0000000000') { //if a linked measuring point exists then validate from measuring point's info

                let linkedMeasuringPoint = await libThis.getLinkedMeasuringPoint(context, sectionBinding);

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
            sectionBinding.Valuation = 'A';
            context.getPageProxy().getControls()[0].sections[index].getControl(valuationControl).setValue("InspectionResultValuations('A')");
            if (libThis.isManualDefectRecordingEnable(context)) {
                FDCSetEditable(context, defectContextProxy, MyButtonLib, recordDefectsButtonName, section, false);
            }
        } else {
            sectionBinding.Valuation = 'R';
            context.getPageProxy().getControls()[0].sections[index].getControl(valuationControl).setValue("InspectionResultValuations('R')");
            if (libThis.isManualDefectRecordingEnable(context)) {
                FDCSetEditable(context, defectContextProxy, MyButtonLib, recordDefectsButtonName, section, true);
            }
        }
        if (libThis.isQuantitative(section.binding)) {
            FDCSetEditable(context, validateContextProxy, MyButtonLib, validateButtonName, section, false);
            FDCSetTitle(context, validateContextProxy, MyButtonLib, validateButtonName, section, context.localizeText('validated'));
        }
        return true;
    }

    static async setInlineError(context, controlName, message) {
        libCom.executeInlineControlError(context, controlName, message);
        return false;
    }

    /* 
        Go to the Inspection Lot and find the measuring points from the related technical object (equipment first then functional location)
        Then from these measuring points find the first one that matches the CharId
    */

    static async getLinkedMeasuringPoint(context, inspectionChar) {
        let inspectionLotArray = await context.read('/SAPAssetManager/Services/AssetManager.service', `${inspectionChar['@odata.readLink']}/InspectionLot_Nav`, [], '');

        if (inspectionLotArray.length > 0) {
            let inspectionLot = inspectionLotArray.getItem(0);

            if (inspectionLot) {
                let measuringPointArray = [];
                let equipment = inspectionLot.Equipment;
                let functionalLocation = inspectionLot.FunctionalLocation;
                let queryOptions = `$filter=CharId eq '${inspectionChar.CharId}'&$top=1`;

                if (equipment) {
                    let count = await context.count('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${equipment}')`, '');
                    if (count > 0) {
                        measuringPointArray = await context.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${equipment}')/MeasuringPoints`, [], queryOptions);
                        if (measuringPointArray.length > 0) {
                            return measuringPointArray.getItem(0);
                        }
                    }
                }

                if (functionalLocation) {
                    let count = await context.count('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${functionalLocation}')`, '');
                    if (count > 0) {
                        measuringPointArray = await context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${functionalLocation}')/MeasuringPoints`, [], queryOptions);
                        if (measuringPointArray.length > 0) {
                            return measuringPointArray.getItem(0);
                        }
                    }
                }

            }
        }

        return '';
    }

    /**
    * checks required characteristic dependency array and enables/disables each control based on required char valuation
    */
    static async enableDependentCharacteristics(context, binding, sectionBindings) {
        if (libCom.isDefined(binding.InspCharDependency_Nav)) {
            for (const char of binding.InspCharDependency_Nav) {
                const dependentCharBinding = sectionBindings.find(item => item.InspectionChar === char.DependentInspChar && item.InspectionNode === char.InspectionNode);
                if (dependentCharBinding) {
                    if (char.AfterAcceptance === 'X') {
                        const editable = binding.Valuation === 'A';
                        await libThis.enableSectionWithBinding(context, dependentCharBinding, editable);
                    } else if (char.AfterRejection === 'X') {
                        const editable = binding.Valuation === 'R';
                        await libThis.enableSectionWithBinding(context, dependentCharBinding, editable);
                    }
                }
            }
        }
    }

    /**
    * checks required characteristic dependency array and gets array of controls that are disabled or have no value
    */
    static async getDependentCharacteristics(context, binding, sectionBindings) {
        if (libCom.isDefined(binding.InspCharDependency_Nav)) {
            let dependentCharArray = [];
            for (const char of binding.InspCharDependency_Nav) {
                const dependentCharBinding = sectionBindings.find(item => item.InspectionChar === char.DependentInspChar && item.InspectionNode === char.InspectionNode);
                if (dependentCharBinding) {
                    if ((char.AfterAcceptance === 'X' && binding.Valuation === 'A') ||
                        (char.AfterRejection === 'X' && binding.Valuation === 'R')) {
                        const isValueDefined = await libThis.isDependentControlValueDefined(context, dependentCharBinding);
                        if (!isValueDefined) {
                            dependentCharArray.push(dependentCharBinding);
                        }
                    }
                }
            }
            return dependentCharArray;
        } else {
            return [];
        }
    }

    /**
    * gets value control based on binding
    */
    static async getValueControlWithBinding(context, binding) {
        const quantitativeControl = 'QuantitativeValue';
        const qualitativeSegmentControl = 'QualitativeValueSegment';
        const qualitativeControl = 'QualitativeValue';
        let controlName;
        if (libThis.isQuantitative(binding)) {
            controlName = quantitativeControl;
        } else {
            const results = await context.read('/SAPAssetManager/Services/AssetManager.service', 'InspectionCodes', [], '$filter=(SelectedSet eq \'' + binding.SelectedSet + '\' and Plant eq \'' + binding.SelectedSetPlant + '\' and Catalog eq \'' + binding.Catalog + '\')');
            controlName = results.length <= 4 ? qualitativeSegmentControl : qualitativeControl;
        }
        return libThis.getControlWithBinding(context, binding, controlName);
    }

    /**
    * finds section based on binding and returns a control by name
    */
    static getControlWithBinding(context, binding, controlName) {
        let fdcHelper = new FDCSectionHelper(context);
        let index = fdcHelper.findSectionWithbinding(binding);
        if (index !== -1) {
            return context.getPageProxy().getControls()[0].sections[index].getControl(controlName);
        }
        return null;
    }

    /**
    * checks if dependent char control is enabled and value exists
    */
    static async isDependentControlValueDefined(context, binding) {
        let valueCtrl = await libThis.getValueControlWithBinding(context, binding);
        if (valueCtrl) {
            return valueCtrl.getEditable() && libCom.getControlValue(valueCtrl);
        }
        return true;
    }

    /**
    * finds control based on binding and sets warning validation message
    */
    static async setControlWithBindingWarning(context, binding) {
        let valueCtrl = await libThis.getValueControlWithBinding(context, binding);
        if (valueCtrl) {
            libCom.executeInlineControlWarning(context, valueCtrl, context.localizeText('provide_value_msg'));
        }
    }

    /**
    * finds section based on binding and enables/disables it
    */
    static async enableSectionWithBinding(context, binding, enabled) {
        let valueCtrl = await libThis.getValueControlWithBinding(context, binding);
        let valuationCtrl = libThis.getControlWithBinding(context, binding, 'Valuation');
        let commentCtrl = libThis.getControlWithBinding(context, binding, 'ShortTextComment');
        if (valueCtrl) {
            if (!enabled) {
                valueCtrl.setValue('');
            }
            valueCtrl.setEditable(enabled);
        }
        if (valuationCtrl) {
            if (!enabled) {
                valuationCtrl.setValue('');
            }
            valuationCtrl.setEditable(enabled);
        }
        if (commentCtrl) {
            if (!enabled) {
                commentCtrl.setValue('');
            }
            commentCtrl.setEditable(enabled);
        }
        libThis.disableButtonsSection(context, binding, enabled);
    }

    /**
    * enables/disables buttons section for characteristic
    */
    static disableButtonsSection(context, binding, enabled) {
        let extensionName;
        let recordDefectsButtonName;
        let moreInfoButtonName;
        let validateOrCalculateButtonName;
        if (deviceType(context) === 'Tablet') {
            extensionName = 'MyExtensionControlName';
            recordDefectsButtonName = 'RecordDefectsButtonTablet';
            moreInfoButtonName = 'MoreInformationButtonTablet';
            validateOrCalculateButtonName = 'ValidateOrCalculateButtonTablet';
        } else {
            extensionName = 'MyExtensionControlNameRecordDefect';
            recordDefectsButtonName = 'RecordDefectsButton';
            moreInfoButtonName = 'MoreInformationButton';
            validateOrCalculateButtonName = 'ValidateOrCalculateButton';
        }
        if (isWindows(context)) {
            libThis.getControlWithBinding(context, binding, recordDefectsButtonName).setEditable(enabled);
            libThis.getControlWithBinding(context, binding, moreInfoButtonName).setEditable(enabled);
            libThis.getControlWithBinding(context, binding, validateOrCalculateButtonName).setEditable(enabled);
        } else {
            let extensionControl = libThis.getControlWithBinding(context, binding, extensionName);
            let contextProxy = extensionControl.getExtension().context.clientAPI;
            if (contextProxy) {
                MyButtonLib.setEditable(contextProxy, recordDefectsButtonName, enabled);
                MyButtonLib.setEditable(contextProxy, moreInfoButtonName, enabled);
                MyButtonLib.setEditable(contextProxy, validateOrCalculateButtonName, enabled);
            }
        }
    }

    static checkEDTReadingCounts(context, extension) {
        if (extension) {
            let valuations = InspectionValuationVar.getInspectionResultValuations();
            let allRows = extension.getRowBindings();
            let emptyCount = 0;
            if (allRows && allRows.length > 0) {
                for (let i = 0; i < allRows.length; i++) {
                    if (extension.getRowCellByName(i, 'Valuation').getValue() !== '' && valuations[extension.getRowCellByName(i, 'Valuation').getValue()] !== '') {
                        emptyCount = emptyCount + 1;
                    }
                }
            }
            return context.localizeText('x_of_x_complete', [emptyCount, allRows.length]);
        }
        return context.localizeText('incomplete');
    }
}
