import CommonLibrary from '../../Common/Library/CommonLibrary';
import inspCharLib from './InspectionCharacteristics';
import libLocal from '../../Common/Library/LocalizationLibrary';
import InspectionCharacteristicsLinkedMeasuringPointValidation from './InspectionCharacteristicsLinkedMeasuringPointValidation';
import libVal from '../../Common/Library/ValidationLibrary';

export const MaxCommentLength = 40;

export default async function InspectionCharacteristicsUpdateValidation(context, sectionBinding, section) {
    let qualitativeValueControl = section.getControl('QualitativeValue');
    let qualitativeValueSegmentControl = section.getControl('QualitativeValueSegment');
    let quantitativeControl = section.getControl('QuantitativeValue');
    if (qualitativeValueControl.visible) {
        CommonLibrary.setInlineControlErrorVisibility(qualitativeValueControl, false);
        qualitativeValueControl.clearValidation();
        if (inspCharLib.isRequired(sectionBinding) && qualitativeValueControl.getValue().length === 0) {
            return setInlineError(qualitativeValueControl, context.localizeText('field_is_required'));
        }
    } else if (qualitativeValueSegmentControl.visible) {
        CommonLibrary.setInlineControlErrorVisibility(qualitativeValueSegmentControl, false);
        qualitativeValueSegmentControl.clearValidation();
        if (inspCharLib.isRequired(sectionBinding) && qualitativeValueSegmentControl.getValue().length === 0) {
            return setInlineError(qualitativeValueSegmentControl, context.localizeText('field_is_required'));
        }
    }
    CommonLibrary.setInlineControlErrorVisibility(quantitativeControl, false);
    quantitativeControl.clearValidation();

    let isCommentValid = await validateComment(section, sectionBinding);
    if (!isCommentValid) {
        return isCommentValid;
    }

    if (inspCharLib.isQuantitative(sectionBinding) || inspCharLib.isCalculatedAndQuantitative(sectionBinding)) {
        let value = quantitativeControl.getValue();
        if (inspCharLib.isRequired(sectionBinding) && libVal.evalIsEmpty(value)) {
            return setInlineError(quantitativeControl, context.localizeText('field_is_required'));
        }
        if (quantitativeControl.getEditable() === true && !libVal.evalIsEmpty(value) && !libLocal.isNumber(context, value)) {
            return setInlineError(quantitativeControl, context.localizeText('validation_reading_is_numeric'), true);
        } else {
            let valueAccepted = true;

            if ((sectionBinding.LowerLimitFlag === 'X' && value < sectionBinding.LowerLimit) || (sectionBinding.UpperLimitFlag === 'X' && value > sectionBinding.UpperLimit)) {
                valueAccepted = false;
            }

            if (sectionBinding.CharId !== '' && sectionBinding.CharId !== '0000000000') { //if a linked measuring point exists then validate from measuring point's info

                let linkedMeasuringPoint = await inspCharLib.getLinkedMeasuringPoint(context, sectionBinding);

                if (linkedMeasuringPoint) {
                    valueAccepted = await InspectionCharacteristicsLinkedMeasuringPointValidation(context, linkedMeasuringPoint, quantitativeControl).then((accepted) => {
                        return accepted;
                    }).catch(() => {
                        return false;
                    });

                    return valueAccepted;
                }

            }
        }

    }
    return true;

    function setInlineError(controlName, message, reject = false) {
        CommonLibrary.executeInlineControlError(context, controlName, message);
        return reject ? Promise.reject() : false;
    }
}

export async function validateComment(section, sectionBinding) {
    const commentControl = section.getControl('ShortTextComment');
    const isMandatory = sectionBinding.RemarksRequired === 'X';
    const isMandatoryOnRejection = sectionBinding.RemarksRequiredOnRejection === 'X';

    if (commentControl) {
        commentControl.clearValidation();

        let comment = commentControl.getValue();
        if (!comment && isMandatory) {
            CommonLibrary.executeInlineControlError(section, commentControl, section.localizeText('comment_is_mandatory'));
            return false;
        }

        const isRejection = await isRejectionValuation(section);
        if (!comment && isMandatoryOnRejection && isRejection) {
            CommonLibrary.executeInlineControlError(section, commentControl, section.localizeText('comment_is_mandatory'));
            return false;
        }

        if (comment.length > MaxCommentLength) {
            CommonLibrary.executeInlineControlError(section, commentControl, section.localizeText('maximum_field_length', [MaxCommentLength]));
            return false;
        }
    }

    return true;
}

export function isRejectionValuation(section, valuation) {
    if (valuation === 'R' || valuation === 'F') {
        return Promise.resolve(true);
    } else if (valuation) {
        return Promise.resolve(false);
    }

    let valCtrl = section.getControl('Valuation');
    let valReadLink = CommonLibrary.getControlValue(valCtrl);
    if (valReadLink) {
        return section.read('/SAPAssetManager/Services/AssetManager.service', valReadLink, [], '').then(result => {
            if (result && result.getItem(0)) {
                valuation = result.getItem(0).Valuation;
                if (valuation === 'R' || valuation === 'F') {
                    return true;
                }
            }
            return false;
        });
    } else {
        return Promise.resolve(false);
    }
}

export async function ValidateDependentCharsEmpty(context, sectionBinding) {
    if (sectionBinding.RequiredChar === 'X') {
        const sectionBindings = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings;
        const dependentChars = await inspCharLib.getDependentCharacteristics(context, sectionBinding, sectionBindings);
        if (CommonLibrary.isDefined(dependentChars)) {
            const result = await context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                'Properties': {
                    'Title': context.localizeText('confirm'),
                    'Message': context.localizeText('dependent_chars_warning_msg', [
                        `${sectionBinding.InspectionChar} - ${sectionBinding.ShortDesc}`, 
                        dependentChars.map(char => `${char.InspectionChar} - "${char.ShortDesc}"`).join(', '),
                    ]),
                    'OKCaption': context.localizeText('confirm'),
                    'CancelCaption': context.localizeText('cancel'),
                },
            });
            let selection = JSON.parse(result.data);
            if (selection === false) {
                for (const char of dependentChars) {
                    let charBinding = sectionBindings.find(item => item.InspectionChar === char.InspectionChar && item.InspectionNode === char.InspectionNode);
                    inspCharLib.enableSectionWithBinding(context, charBinding, true);
                    inspCharLib.setControlWithBindingWarning(context, charBinding);
                }
                return false;
            }
        }
    }
    return true;
}
