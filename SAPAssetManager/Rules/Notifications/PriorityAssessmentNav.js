import {DynamicPageGenerator} from '../FDC/DynamicPageGenerator';
import {ConvertValueForUnits} from '../Common/UnitConverter';

/**
* Re-populates the Priority Assessment page based on previous page's client data
* @param {IClientAPI} context
*/
function PriorityAssessmentRepopulate(context) {
    let empData = context.getPageProxy().getClientData().EMP;

    let workRequestConsequenceData = Promise.resolve([]); // By default, assume a create page (no @odata.readLink), so no WorkRequestConsequences exist

    if (context.getPageProxy().binding['@odata.readLink'] && context.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyNotificationHeader') { // if @odata.readLink exists, attempt to read existing WorkRequestConsequences
        workRequestConsequenceData = context.read('/SAPAssetManager/Services/AssetManager.service', `${context.getPageProxy().binding['@odata.readLink']}/WorkRequestConsequence_Nav`, [], '');
    }
    return workRequestConsequenceData.then(async result => {
        if (result.length > 0 && !empData) { // Only populate if empData is empty and results exist
            empData = {};
            for (const value of result) {
                empData[`ConsequenceCategories(PrioritizationProfileId='${value.PrioritizationProfileId}',CategoryId='${value.CategoryId}',GroupId='${value.GroupId}')`] =
                {
                    'Consequence': String(value.ConsequenceId),
                    'Likelihood': String(value.LikelihoodId),
                };
                if (value.LeadingConsequence) {
                    if (value.ConsequenceId) {
                        // Get Consequence Description
                        let consequenceDescription = context.read('/SAPAssetManager/Services/AssetManager.service',
                        `ConsequenceSeverities(GroupId='${value.GroupId}',` +
                        `PrioritizationProfileId='${value.PrioritizationProfileId}',` +
                        `ConsequenceId='${value.ConsequenceId}',` +
                        `CategoryId='${value.CategoryId}')`, [], '').then(readResult => {
                            return readResult.getItem(0).Description;
                        }, () => {
                            return '';
                        });
                        // Get Likelihood Description
                        let likelihoodDescription = context.read('/SAPAssetManager/Services/AssetManager.service',
                        `ConsequenceLikelihoods('${value.LikelihoodId}')`, [], '').then(readResult => {
                            return readResult.getItem(0).Description;
                        }, () => {
                            return '';
                        });
                        // Get Priority Data
                        let priorityData = await context.read('/SAPAssetManager/Services/AssetManager.service',
                        `PrioritizationMaps(ConsequenceId='${value.ConsequenceId}',` +
                        `PrioritizationProfileId='${value.PrioritizationProfileId}',` +
                        `LikelihoodId='${value.LikelihoodId}',` +
                        `CategoryId='${value.CategoryId}',` +
                        `GroupId='${value.GroupId}')`, [], '').then(prioritizationMapLookup => {
                            return context.read('/SAPAssetManager/Services/AssetManager.service', `Priorities(Priority='${prioritizationMapLookup.getItem(0).Priority}',PriorityType='PM')`, [], '').then(priorityLookup => {
                                return priorityLookup.getItem(0);
                            }, () => {
                                return {'PriorityDescription' : '', 'Priority': '', 'FinalDueDateDuration' : '0', 'FinalDueDateUoM': 'H'};
                            });
                        }, () => {
                            return {'PriorityDescription' : '', 'Priority': '', 'FinalDueDateDuration' : '0', 'FinalDueDateUoM': 'H'};
                        });

                        let dueDateData = ConvertValueForUnits(context, priorityData.FinalDueDateDuration, priorityData.FinalDueDateUoM, 'S').then(convertedResult => {
                            let dueDate = new Date(new Date().getTime() + convertedResult * 1000);
                            dueDate.setHours(0, 0, 0, 0);
                            return context.formatDate(dueDate);
                        });

                        await Promise.all([consequenceDescription, likelihoodDescription, priorityData, dueDateData]).then(([consequence, likelihood, priority, duedate]) => {
                            empData.DueDate = duedate;
                            empData.Priority = priority.PriorityDescription || '';
                            empData.Consequence = consequence || '';
                            empData.Likelihood = likelihood || '';
                        });
                    }
                }
            }
            context.getPageProxy().getClientData().EMP = empData;
        }
    });
}


/**
* Uses Dynamic Page Generator to create and navigate to
* the Priority Assessment Page
* @param {IClientAPI} context
*/
export default function PriorityAssessmentNavNew(context) {
	let sectionData =
        [{
            '_Type': 'Section.Type.FormCell',
            '_Name': 'FormCellSection',
            'Controls':
            [{
                'Caption': '$(L,assessed_priority)',
                'Value': '#Page:NotificationAddPage/#ClientData/#Property:EMP/#Property:Priority',
                'IsEditable': false,
                '_Name': 'Priority',
                '_Type': 'Control.Type.FormCell.SimpleProperty',
            },
            {
                'Caption': '$(L,leading_consequence)',
                'Value': '#Page:NotificationAddPage/#ClientData/#Property:EMP/#Property:Consequence',
                'IsEditable': false,
                '_Name': 'LeadingConsequence',
                '_Type': 'Control.Type.FormCell.SimpleProperty',
            },
            {
                'Caption': '$(L,leading_likelihood)',
                'Value': '#Page:NotificationAddPage/#ClientData/#Property:EMP/#Property:Likelihood',
                'IsEditable': false,
                '_Name': 'LeadingLikelihood',
                '_Type': 'Control.Type.FormCell.SimpleProperty',
            },
            {
                'Caption': '$(L,final_due_date)',
                'Value': '#Page:NotificationAddPage/#ClientData/#Property:EMP/#Property:DueDate',
                'IsEditable': false,
                '_Name': 'FinalDueDate',
                '_Type': 'Control.Type.FormCell.SimpleProperty',
            }],
        },
        {
            '_Type': 'Section.Type.FormCell',
            '_Name': 'FormCellSection',
            'Target':
            {
                'EntitySet': 'ConsequenceCategories',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'QueryOptions': '/SAPAssetManager/Rules/Notifications/EMP/ConsequenceCategoryFilter.js',
            },
            'Controls':
            [{
                '_Type': 'Control.Type.FormCell.Extension',
                '_Name': 'Caption',
                'Module': 'HeaderFormCellModule',
                'Control': 'HeaderFormCellExtension',
                'Class': 'HeaderFormCellClass',
                'Height': 44,
                'ExtensionProperties':
                {
                    'Title': '{{#Property:Title}} - {{#Property:Subtitle}}',
                },
            },
            {
                'Caption': '$(L,consequence)',
                'AllowMultipleSelection': false,
                'IsPickerDismissedOnSelection': true,
                'IsSearchCancelledAfterSelection': true,
                'Search': {
                    'Enabled': true,
                    'Delay': 500,
                    'MinimumCharacterThreshold': 3,
                    'Placeholder': '$(L,search)',
                    'BarcodeScanner': true,
                },
                'Value': '/SAPAssetManager/Rules/Notifications/CreateUpdate/ConsequenceDefaultValue.js',
                'PickerItems':
                {
                    'DisplayValue': '{{#Property:Description}}',
                    'ReturnValue': '{ConsequenceId}',
                    'Target':
                    {
                        'EntitySet': '{{#Property:@odata.readLink}}/ConsequenceSeverity_Nav',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': '$orderby=Position',
                    },
                },
                'OnValueChange': '/SAPAssetManager/Rules/Notifications/CreateUpdate/PriorityAssessment.js',
                '_Type': 'Control.Type.FormCell.ListPicker',
                '_Name': 'ConsequencePicker',
            },
            {
                'Caption': '$(L,likelihood)',
                'AllowMultipleSelection': false,
                'IsPickerDismissedOnSelection': true,
                'IsSearchCancelledAfterSelection': true,
                'Search': {
                    'Enabled': true,
                    'Delay': 500,
                    'MinimumCharacterThreshold': 3,
                    'Placeholder': '$(L,search)',
                    'BarcodeScanner': true,
                },
                'Value': '/SAPAssetManager/Rules/Notifications/CreateUpdate/LikelihoodDefaultValue.js',
                'PickerItems':
                {
                    'DisplayValue': '{{#Property:Description}}',
                    'ReturnValue': '{LikelihoodId}',
                    'Target':
                    {
                        'EntitySet': 'ConsequenceLikelihoods',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': '$orderby=Position',
                    },
                },
                'OnValueChange': '/SAPAssetManager/Rules/Notifications/CreateUpdate/PriorityAssessment.js',
                '_Type': 'Control.Type.FormCell.ListPicker',
                '_Name': 'LikelihoodPicker',
            }],
        },
        {
            '_Type': 'Section.Type.FormCell',
            '_Name': 'FormCellSection',
            'Controls': [
                {
                    'Title': '$(L,clear_all)',
                    'OnPress': '/SAPAssetManager/Rules/Notifications/PriorityAssessmentClearAll.js',
                    '_Type': 'Control.Type.FormCell.Button',
                    '_Name': 'ClearAllButton',
                    'TextAlignment': '/SAPAssetManager/Rules/Common/Platform/ModalButtonAlign.js',
                },
            ],
        }];

    return PriorityAssessmentRepopulate(context).then(() => {
        if (context.getPageProxy().evaluateTargetPath('#Control:TypeLstPkr/#Value').length === 1) {
            let generator = new DynamicPageGenerator(
                context.getPageProxy(),
                null,
                sectionData,
                {
                    'OnLoaded': '/SAPAssetManager/Rules/Notifications/CreateUpdate/PriorityAssessmentRepopulate.js',
                    'Caption': context.localizeText('assess_priority'),
                    'ActionBar': {
                        'Items': [],
                    },
                },
            );
            return generator.navToPage();
        } else {
            return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/SelectTypeMessage.action');
        }
    });
}
