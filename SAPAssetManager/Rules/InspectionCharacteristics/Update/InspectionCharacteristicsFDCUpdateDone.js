import inspCharLib from './InspectionCharacteristics';
import {FDCSectionHelper} from '../../FDC/DynamicPageGenerator';
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import InspectionCharacteristicsUpdateValidation, {ValidateDependentCharsEmpty} from './InspectionCharacteristicsUpdateValidation';
import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import InspectionCharacteristicsChangeSetOnSuccess from './InspectionCharacteristicsChangeSetOnSuccess';
import InspectionCharacteristicsLinkedMeasuringPointValuation from './InspectionCharacteristicsLinkedMeasuringPointValuation';

export default function InspectionCharacteristicsFDCUpdateDone(context) {
   let fdcHelper = new FDCSectionHelper(context);
    // Validate all sections first
    return fdcHelper.run((sectionBinding, section) => {
        return InspectionCharacteristicsUpdateValidation(context, sectionBinding, section);
    }).then((results) => {
        if (results.some(value => value === false)) {
            // if any section contain errors/warnings, display warning popup to user
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                'Properties': {
                    'Title': context.localizeText('confirm'),
                    'Message': context.localizeText('data_contain_errors_warning_msg'),
                    'OKCaption': context.localizeText('yes'),
                    'CancelCaption': context.localizeText('no'),
                },
            }).then(result => {
                let selection = JSON.parse(result.data);
                if (selection === false) {
                    return Promise.reject();
                }
                return Promise.resolve();
            });
        }
        return Promise.resolve();
    }).then(() => {
        return fdcHelper.run(async (sectionBinding) => {
            return ValidateDependentCharsEmpty(context, sectionBinding).then((result) => {
                return result ? Promise.resolve() : Promise.reject();
            });
        });
    }).then(() => {
        return fdcHelper.run(async (sectionBinding, section) => {
            let valuation = await getValuation(context, sectionBinding, section);
            let valuationReaddlink = await getValuationReaddlink(context, sectionBinding, section);
            let comment = getComment(section);
            if ((inspCharLib.isQuantitative(sectionBinding) || inspCharLib.isCalculatedAndQuantitative(sectionBinding)) && (!libVal.evalIsEmpty(section.getControl('QuantitativeValue').getValue())) && (libLocal.isNumber(context, section.getControl('QuantitativeValue').getValue()))) {
                let resultValue = section.getControl('QuantitativeValue').getValue();
                if (typeof(resultValue) === 'string' && libCom.isDefined(resultValue)) {
                    resultValue = libLocal.toNumber(context, resultValue);
                }

                return context.executeAction({'Name': '/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsQuantitativeUpdate.action', 'Properties': {
                    'Target': {
                        'EntitySet': 'InspectionCharacteristics',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': sectionBinding['@odata.readLink'],
                    },
                    'Properties': {
                        'ResultValue': resultValue,
                        'Valuation': valuation,
                        'Remarks': comment,
                    },
                    'Headers':
                    {
                        'OfflineOData.TransactionID': sectionBinding.InspectionLot_Nav.InspectionLot,
                    },
                    'UpdateLinks':
                    [{
                        'Property': 'InspValuation_Nav',
                        'Target': {
                            'EntitySet': 'InspectionResultValuations',
                            'ReadLink': valuationReaddlink,
                        },
                    }],
                    'ValidationRule': '',
                }}).catch(() => {
                    return false;
                }).finally(() => {
                    return true;
                });
            } else if (inspCharLib.isQualitative(sectionBinding) && (!libVal.evalIsEmpty(section.getControl('QualitativeValueSegment').getValue()[0]) || !libVal.evalIsEmpty(section.getControl('QualitativeValue').getValue()[0]))) {
                return getAction(section, sectionBinding, context, comment);
            }
            return false;
        }).catch(() => {
            return false;
        });
    }).then((results) => {
        if (results.some(value => value === true || value instanceof Object)) {
            return InspectionCharacteristicsChangeSetOnSuccess(context);
        }
        return context.executeAction('/SAPAssetManager/Actions/Common/NoDataChanged.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        });
    });
}

function getAction(section, sectionBinding, context, comment) {
    let CodeGroup = '';
    let Code = '';
    let Catalog = '';
    let valuationReturnValue = section.getControl('Valuation').getValue()[0].ReturnValue;
    let valuation = valuationReturnValue.substring(valuationReturnValue.indexOf('\'')+1, valuationReturnValue.indexOf('\'')+2);
    if (!libVal.evalIsEmpty(section.getControl('QualitativeValueSegment').getValue()[0])) {
        CodeGroup = decodeURIComponent(SplitReadLink(section.getControl('QualitativeValueSegment').getValue()[0].ReturnValue).CodeGroup);
        Code = SplitReadLink(section.getControl('QualitativeValueSegment').getValue()[0].ReturnValue).Code;
        Catalog = SplitReadLink(section.getControl('QualitativeValueSegment').getValue()[0].ReturnValue).Catalog;
    } else if (!libVal.evalIsEmpty(section.getControl('QualitativeValue').getValue()[0])) {
        CodeGroup = decodeURIComponent(SplitReadLink(section.getControl('QualitativeValue').getValue()[0].ReturnValue).CodeGroup);
        Code = SplitReadLink(section.getControl('QualitativeValue').getValue()[0].ReturnValue).Code;
        Catalog = SplitReadLink(section.getControl('QualitativeValue').getValue()[0].ReturnValue).Catalog;
    }

    let createLinks = [];
    if (libVal.evalIsEmpty(sectionBinding.InspValuation_Nav) && !libVal.evalIsEmpty(section.getControl('Valuation').getValue()[0])) {
        createLinks.push({
            'Property': 'InspValuation_Nav',
            'Target':
            {
                'EntitySet': 'InspectionResultValuations',
                'ReadLink': section.getControl('Valuation').getValue()[0].ReturnValue,
            },
        });
    }
    if (libVal.evalIsEmpty(sectionBinding.InspectionCode_Nav) && !libVal.evalIsEmpty(section.getControl('QualitativeValueSegment').getValue()[0])) {
        createLinks.push({
            'Property': 'InspectionCode_Nav',
            'Target':
            {
                'EntitySet': 'InspectionCodes',
                'ReadLink': section.getControl('QualitativeValueSegment').getValue()[0].ReturnValue,
            },
        });
    } else if (libVal.evalIsEmpty(sectionBinding.InspectionCode_Nav) && !libVal.evalIsEmpty(section.getControl('QualitativeValue').getValue()[0])) {
        createLinks.push({
            'Property': 'InspectionCode_Nav',
            'Target':
            {
                'EntitySet': 'InspectionCodes',
                'ReadLink': section.getControl('QualitativeValue').getValue()[0].ReturnValue,
            },
        });
    }

    let updateLinks = [];
    if (!libVal.evalIsEmpty(sectionBinding.InspValuation_Nav) && !libVal.evalIsEmpty(section.getControl('Valuation').getValue()[0])) {
        updateLinks.push({
            'Property': 'InspValuation_Nav',
            'Target':
            {
                'EntitySet': 'InspectionResultValuations',
                'ReadLink': section.getControl('Valuation').getValue()[0].ReturnValue,
            },
        });
    }
    if (!libVal.evalIsEmpty(sectionBinding.InspectionCode_Nav) && !libVal.evalIsEmpty(section.getControl('QualitativeValue').getValue()[0])) {
        updateLinks.push({
            'Property': 'InspectionCode_Nav',
            'Target':
            {
                'EntitySet': 'InspectionCodes',
                'ReadLink': section.getControl('QualitativeValue').getValue()[0].ReturnValue,
            },
        });
    } else if (!libVal.evalIsEmpty(sectionBinding.InspectionCode_Nav) && !libVal.evalIsEmpty(section.getControl('QualitativeValueSegment').getValue()[0])) {
        updateLinks.push({
            'Property': 'InspectionCode_Nav',
            'Target':
            {
                'EntitySet': 'InspectionCodes',
                'ReadLink': section.getControl('QualitativeValueSegment').getValue()[0].ReturnValue,
            },
        });
    }

    return context.executeAction({'Name': '/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeUpdate.action', 'Properties': {
        'Target': {
            'EntitySet': 'InspectionCharacteristics',
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'ReadLink': sectionBinding['@odata.readLink'],
        },
        'Properties':
        {
            'CodeGroup': CodeGroup,
            'Valuation': valuation,
            'Code': Code,
            'Catalog': Catalog,
            'Remarks': comment,
        },
        'CreateLinks': createLinks,
        'UpdateLinks': updateLinks,
        'Headers':
        {
            'OfflineOData.TransactionID': sectionBinding.InspectionLot_Nav.InspectionLot,
        },
        'ValidationRule': '',
    }}).catch(() => {
        return false;
    }).finally(() => {
        return true;
    });
}

async function getValuation(context, sectionBinding, section) {
    const valueAccepted = await isValueAccepted(context, sectionBinding, section);
    if (valueAccepted) {
        return 'A';
    }
    return 'R';
}

async function getValuationReaddlink(context, sectionBinding, section) {
    const valueAccepted = await isValueAccepted(context, sectionBinding, section);
    if (valueAccepted) {
        return 'InspectionResultValuations(\'A\')';
    }
    return 'InspectionResultValuations(\'R\')';
}

function getComment(section) {
    return section.getControl('ShortTextComment').getValue();
}

async function isValueAccepted(context, sectionBinding, section) {
    if ((inspCharLib.isQuantitative(sectionBinding) || inspCharLib.isCalculatedAndQuantitative(sectionBinding)) && (sectionBinding.TargetValue === section.getControl('QuantitativeValue').getValue())) {
        return true;
    } else {
        let valueAccepted = true;
        const value = section.getControl('QuantitativeValue').getValue();
        valueAccepted = validateUpperLowerLimits(sectionBinding, value);

        if (sectionBinding.CharId !== '' && sectionBinding.CharId !== '0000000000') { //if a linked measuring point exists then validate from measuring point's info

            let linkedMeasuringPoint = await inspCharLib.getLinkedMeasuringPoint(context, sectionBinding);

            if (linkedMeasuringPoint) {
                valueAccepted = await InspectionCharacteristicsLinkedMeasuringPointValuation(context, linkedMeasuringPoint, value).then((accepted) => {
                    return accepted;
                }).catch(() => {
                    return false;
                });

                return valueAccepted;
            }

        }
        return valueAccepted;
    }
}

function validateUpperLowerLimits(sectionBinding, value) {
    return !(sectionBinding.LowerLimitFlag === 'X' && (value < sectionBinding.LowerLimit || value > sectionBinding.UpperLimit));
}
