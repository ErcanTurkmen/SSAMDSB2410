import { FDCSectionHelper } from '../FDC/DynamicPageGenerator';
import ChecklistValidation from './ChecklistValidation';
import libVal from '../Common/Library/ValidationLibrary';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import Logger from '../Log/Logger';

export default function ChecklistQuestionsUpdateNav(context) {
    let fdcHelper = new FDCSectionHelper(context);
    // Validate all sections first
    // eslint-disable-next-line no-unused-vars
    return fdcHelper.run((sectionBinding, section) => {
        return ChecklistValidation(context, section);
    }).then(() => {
        return fdcHelper.run(async (sectionBinding, section) => {
            let formId = sectionBinding.ChecklistBusObject_Nav.Form_Nav.FormId;
            context.evaluateTargetPathForAPI('#Page:-Current').getClientData().FormId = formId;
            let answerListPicker = section.getControl('AnswerLstPkr').getValue();
            if (!libVal.evalIsEmpty(answerListPicker) && answerListPicker.length > 0) {
                let transactionId = formId + sectionBinding.GroupId;
                return context.executeAction({'Name': '/SAPAssetManager/Actions/Checklists/ChecklistAssessmentQuestionUpdate.action', 'Properties': {
                    'Target': {
                        'EntitySet': 'ChecklistAssessmentQuestions',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': sectionBinding['@odata.readLink'],
                    },
                    'Properties': {
                        'SelectedAnswerOptionId': answerListPicker[0].ReturnValue,
                        'Comments': section.getControl('Comments').getValue(),
                        'Version': sectionBinding.Version,
                        'SortNumber': sectionBinding.SortNumber,
                        'ChecklistType': sectionBinding.ChecklistType,
                    },
                    'Headers':
                    {
                        'OfflineOData.TransactionID': transactionId,
                    },
                    'ValidationRule': '',
                }}).then (() => {
                    
                }).catch(() => {
                    return false;
                }).finally(() => {
                    return true;
                });
            }
            return true;
        }).catch(() => {
            return false;
        });
    }).then(() => {
        let formId = context.evaluateTargetPathForAPI('#Page:-Current').getClientData().FormId;
        if (!libVal.evalIsEmpty(formId)) {
            let answered = 0;
            let successAction = '/SAPAssetManager/Actions/Checklists/UpdateChecklistSuccessMessage.action';
            //Read the questions for this assessment
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'ChecklistAssessmentQuestions', [], `$filter=ChecklistBusObject_Nav/Form_Nav/FormId eq '${formId}'&$expand=FormQuestion_Nav,FormGroup_Nav,ChecklistBusObject_Nav`).then(results => {
                if (!libVal.evalIsEmpty(results)) {
                    for (let i = 0; i < results.length; i++) {
                        let row = results.getItem(i);
                        if (!libVal.evalIsEmpty(row.SelectedAnswerOptionId)) {
                            answered++; //Question has been answered
                        }
                    }
                    return checkAnswerAmount(context, answered, results, successAction);
                } else {
                    context.dismissActivityIndicator();
                    return ExecuteActionWithAutoSync(context, successAction); //No rows to process
                }
            }, err => {
                context.dismissActivityIndicator();
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryChecklists.global').getValue(),`ChecklistsLibrary.checklistFDCUpdateSuccess() OData read error: ${err}`);
                return Promise.reject(false);
            });
        }
        return true;
    });
}

function checkAnswerAmount(context, answered, results, successAction) {
    if (answered > 0) {
        if (answered < results.length) { //Not all questions answered
            return context.executeAction('/SAPAssetManager/Actions/Checklists/FormsUpdateInProgress.action').then(() => {
                context.dismissActivityIndicator();
                return ExecuteActionWithAutoSync(context, successAction);
            });
        } else { //All questions answered
            return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/ChecklistBusObjects_Nav', [], '').then(function(busObjects_results) {
                // Loop through ChecklistBusObjects, since a Form may have multiple
                let processLoop = function(BusObjectIDs) {
                    if (BusObjectIDs.length > 0) {
                        context.getClientData().ChecklistBusObjectId = BusObjectIDs.pop()['@odata.readLink'];
                        return context.executeAction('/SAPAssetManager/Actions/Checklists/ChecklistSetComplete.action').then(function() {
                            processLoop(BusObjectIDs);
                        });
                    } else {
                        return Promise.resolve();
                    }
                };

                return processLoop(busObjects_results).then(function() {
                    return context.executeAction('/SAPAssetManager/Actions/Checklists/FormsUpdateCompleted.action').then(() => {
                        context.dismissActivityIndicator();
                        return ExecuteActionWithAutoSync(context, successAction);
                    });
                });
            });
        }
    } else {
        context.dismissActivityIndicator();
        return ExecuteActionWithAutoSync(context, successAction); //No questions answered
    }
}
