import inspCharLib from './InspectionCharacteristics';
import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import libVal from '../../Common/Library/ValidationLibrary';
import InspectionCharacteristicsChangeSetOnSuccessEDT from './InspectionCharacteristicsChangeSetOnSuccessEDT';
import { InspectionValuationVar} from '../../Common/Library/GlobalInspectionResults';
import InspectionCharacteristicsUpdateValidationEDT, {validateDependentCharacteristics} from './InspectionCharacteristicsUpdateValidationEDT';
import libCom from '../../Common/Library/CommonLibrary';
import DocumentCreateBDS from '../../Documents/Create/DocumentCreateBDS';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default async function InspectionCharacteristicsUpdateDoneEDT(context) {
    let sections = context.getPageProxy().getControls()[0].getSections();
    let extension;
    if (sections && sections.length > 0) {
        let validateResults = [];
        for (let section of sections) {
            if (section.getExtension() && section.getExtension().constructor && section.getExtension().constructor.name === 'EditableDataTableViewExtension') {
                extension = section.getExtension();
                if (extension) {
                    //validate all required chars and dependent chars
                    let validateRows = extension.getValues();
                    for (let validateRow of validateRows) {
                        validateResults.push(await InspectionCharacteristicsUpdateValidationEDT(context, extension, validateRow));
                    }
                }
            }
        }

        return Promise.all(validateResults).then((results) => {
            // if any section contain errors/warnings, display warning popup to user
            if (results.includes(false)) {
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
        }).then(async () => {
            let dependentResults = [];
            for (let section of sections) {
                if (section.getExtension() && section.getExtension().constructor && section.getExtension().constructor.name === 'EditableDataTableViewExtension') {
                    extension = section.getExtension();
                    if (extension) {
                        //validate all dependent chars
                        let validateRows = extension.getValues();
                        for (let validateRow of validateRows) {
                            dependentResults.push(await validateDependentCharacteristics(context, extension, validateRow));
                        }
                    }
                }
            }
            return Promise.all(dependentResults).then((results) => {
                return !results.includes(false) ? Promise.resolve() : Promise.reject();
            }).then(() => {
                let promises = [];
                let valuations = InspectionValuationVar.getInspectionResultValuations();
                for (let section of sections) {
                    if (section.getExtension() && section.getExtension().constructor && section.getExtension().constructor.name === 'EditableDataTableViewExtension') {
                        extension = section.getExtension();
                        if (extension) {
                            let rows = extension.getUpdatedValues();
                            for (let row of rows) {
                                let quantitativeAction = '/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsQuantitativeUpdate.action';
                                let qualitativeAction = '/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeUpdate.action';
                                let valuation = '';
                                let remarks = '';
                                if (Object.prototype.hasOwnProperty.call(row.Properties, 'Valuation')) {
                                    valuation = valuations[row.Properties.Valuation];
                                } else {
                                    valuation = row.OdataBinding.Valuation;
                                }

                                if (!valuation) valuation = '';

                                if (Object.prototype.hasOwnProperty.call(row.Properties, 'Remarks')) {
                                    remarks = row.Properties.Remarks;
                                } else {
                                    remarks = row.OdataBinding.Remarks;
                                }
                                if (inspCharLib.isQuantitative(row.OdataBinding) || inspCharLib.isCalculatedAndQuantitative(row.OdataBinding)) {
                                    let resultValue;
                                    if (Object.prototype.hasOwnProperty.call(row.Properties, 'ResultValue')) {
                                        resultValue = row.Properties.ResultValue;
                                    } else {
                                        resultValue = row.OdataBinding.ResultValue;
                                    }

                                    if (!resultValue) resultValue = 0;
                                
                                    const properties = {
                                        'Target': {
                                            'EntitySet': 'InspectionCharacteristics',
                                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                                            'ReadLink': row.OdataBinding['@odata.readLink'],
                                        },
                                        'Headers':
                                        {
                                            'OfflineOData.TransactionID': row.OdataBinding.InspectionLot_Nav.InspectionLot,
                                        },
                                        'Properties': {
                                            'ResultValue': resultValue,
                                            'Valuation': valuation,
                                            'Remarks': remarks,
                                        },
                                        'UpdateLinks':
                                        [{
                                            'Property': 'InspValuation_Nav',
                                            'Target': {
                                                'EntitySet': 'InspectionResultValuations',
                                                'ReadLink': `InspectionResultValuations('${valuation}')`,
                                            },
                                        }],
                                        'ValidationRule': '',
                                    };
                                    promises.push(context.executeAction({
                                        'Name': quantitativeAction,
                                        'Properties': properties,
                                    }));
                                } else if (inspCharLib.isQualitative(row.OdataBinding)) {
                                    let CodeGroup = '';
                                    let Code = '';
                                    let Catalog = '';
                                    let InspectionCodeReadLink;
                                    if (!libVal.evalIsEmpty(row.OdataBinding.InspectionCode_Nav)) {
                                        InspectionCodeReadLink = row.OdataBinding.InspectionCode_Nav['@odata.readLink'];
                                    }
                                    if (Object.prototype.hasOwnProperty.call(row.Properties, 'Code') && row.Properties.Code) {
                                        CodeGroup = decodeURIComponent(SplitReadLink(row.Properties.Code).CodeGroup);
                                        Code = SplitReadLink(row.Properties.Code).Code;
                                        Catalog = SplitReadLink(row.Properties.Code).Catalog;
                                        InspectionCodeReadLink = row.Properties.Code;
                                    } else {
                                        CodeGroup = decodeURIComponent(row.OdataBinding.CodeGroup);
                                        Code = row.OdataBinding.Code;
                                        Catalog = row.OdataBinding.Catalog;
                                    }
                                    if (Code) { //Cannot set non-nullable property 'CodeGroup' of type 'string', because the value is unexpectedly null - So currently inspection code cannot be reverted to empty using deletelinks
                                        let createLinks = [];
                                        if (libVal.evalIsEmpty(row.OdataBinding.InspValuation_Nav) && !libVal.evalIsEmpty(valuation)) {
                                            createLinks.push({
                                                'Property': 'InspValuation_Nav',
                                                'Target':
                                                {
                                                    'EntitySet': 'InspectionResultValuations',
                                                    'ReadLink': `InspectionResultValuations('${valuation}')`,
                                                },
                                            });
                                        }
                                        if (libVal.evalIsEmpty(row.OdataBinding.InspectionCode_Nav) && !libVal.evalIsEmpty(Code)) {
                                            createLinks.push({
                                                'Property': 'InspectionCode_Nav',
                                                'Target':
                                                {
                                                    'EntitySet': 'InspectionCodes',
                                                    'ReadLink': row.Properties.Code,
                                                },
                                            });
                                        }
                                        let updateLinks = [];
                                        if (!libVal.evalIsEmpty(row.OdataBinding.InspValuation_Nav) && !libVal.evalIsEmpty(valuation)) {
                                            updateLinks.push({
                                                'Property': 'InspValuation_Nav',
                                                'Target':
                                                {
                                                    'EntitySet': 'InspectionResultValuations',
                                                    'ReadLink': `InspectionResultValuations('${valuation}')`,
                                                },
                                            });
                                        }
                                        if (!libVal.evalIsEmpty(row.OdataBinding.InspectionCode_Nav) && !libVal.evalIsEmpty(Code)) {
                                            updateLinks.push({
                                                'Property': 'InspectionCode_Nav',
                                                'Target':
                                                {
                                                    'EntitySet': 'InspectionCodes',
                                                    'ReadLink': InspectionCodeReadLink,
                                                },
                                            });
                                        }
                                        const properties = {
                                            'Target': {
                                                'EntitySet': 'InspectionCharacteristics',
                                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                                                'ReadLink': row.OdataBinding['@odata.readLink'],
                                            },
                                            'Headers':
                                            {
                                                'OfflineOData.TransactionID': row.OdataBinding.InspectionLot_Nav.InspectionLot,
                                            },
                                            'Properties': {
                                                'CodeGroup': CodeGroup,
                                                'Valuation': valuation,
                                                'Code': Code,
                                                'Catalog': Catalog,
                                                'Remarks': remarks,
                                            },
                                            'CreateLinks': createLinks,
                                            'UpdateLinks': updateLinks,
                                            'ValidationRule': '',
                                        };
                                        promises.push(context.executeAction({
                                            'Name': qualitativeAction,
                                            'Properties': properties,
                                        }));
                                    }
                                }
                            }
                        }
                    }
                }
                let attachments = libCom.getStateVariable(context, 'InspectionCharacteristicsAttachments');
                let deletedAttachments = libCom.getStateVariable(context, 'DeletedInspectionCharacteristicsAttachments');
                let notCreatedDocs = [];
                if (attachments) {
                    notCreatedDocs = attachments.filter(doc => !doc.readLink);
                }
                if (libVal.evalIsEmpty(deletedAttachments)) {
                    deletedAttachments = [];
                }
                if (promises.length === 0 && notCreatedDocs.length === 0 && deletedAttachments.length === 0) {
                    return context.executeAction('/SAPAssetManager/Actions/Common/NoDataChanged.action').then(() => {
                        return InspectionCharacteristicsChangeSetOnSuccessEDT(context);
                    });
                }
                if (promises.length > 0) {
                    return Promise.all(promises).then(() => {
                        return saveAttachments(context).then(() => {
                            return InspectionCharacteristicsChangeSetOnSuccessEDT(context);
                        });
                    });
                } else {
                    return saveAttachments(context).then(() => {
                        return context.getPageProxy().executeAction({
                            'Name': '/SAPAssetManager/Actions/Common/NoDataChanged.action',
                            'Properties': {
                                'Message': context.localizeText('attachments_saved'),
                            },
                        }).then(() => {
                            return InspectionCharacteristicsChangeSetOnSuccessEDT(context);
                        });
                    });
                }
            });
        });
    }
}

async function saveAttachments(context) {
    let attachments = libCom.getStateVariable(context, 'InspectionCharacteristicsAttachments');
    const deletedAttachments = libCom.getStateVariable(context, 'DeletedInspectionCharacteristicsAttachments');
    let deletes = [];
    if (deletedAttachments && deletedAttachments.length > 0) {
        // create an rray with all the readLinks to process
        context.getClientData().DeletedDocReadLinks = deletedAttachments.map((deletedAttachment) => {
            return deletedAttachment.readLink;
        });

        deletes = deletedAttachments.map(() => {
            //call the delete doc delete action
            return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentDeleteBDS.action');
        });
    }
    return Promise.all(deletes).then(() => {
        libCom.setStateVariable(context, 'DeletedInspectionCharacteristicsAttachments', []);
        if (attachments) {
            libCom.setStateVariable(context, 'TransactionType', 'UPDATE');
            let notCreatedDocs = attachments.filter(doc => !doc.readLink);
            if (notCreatedDocs.length > 0) {
                let documentsCreatePromise = libCom.isDefined(notCreatedDocs) ? DocumentCreateBDS(context, notCreatedDocs) : Promise.resolve();
                return documentsCreatePromise.then(() => {
                    libCom.setStateVariable(context, 'InspectionCharacteristicsAttachments', '');
                    return Promise.resolve();
                });
            }
        }
        return Promise.resolve();
    });
}
