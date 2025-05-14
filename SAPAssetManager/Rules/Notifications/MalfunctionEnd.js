import GenerateLocalID from '../Common/GenerateLocalID';
import DocLib from '../Documents/DocumentLibrary';
import documentValidateCreate from '../Documents/DocumentValidation';
import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import Logger from '../Log/Logger';

/**
* Run all actions pertaining to Malfunction End/Work Order Complete
* @param {IClientAPI} context
*/
export default function MalfunctionEnd(context) {

    const formCellContainer = context.getControl('FormCellContainer');
    //Description and list picker field values for Notification Item and Cause Item creation
    const itemDescription = context.evaluateTargetPath('#Control:ItemDescription/#Value') ?? '';
    const causeDescription = context.evaluateTargetPath('#Control:CauseDescription/#Value') ?? '';
    const [objectPartCodeGroup, objectPart, codeGroup, damageCode, causeCodeGroup, causeCode ] = [
        'PartGroupLstPkr', 'PartDetailsLstPkr','DamageGroupLstPkr', 'DamageDetailsLstPkr', 'CauseGroupLstPkr', 'CodeLstPkr']
        .map (controlName => formCellContainer.getControl(controlName)?.getValue())   
        .map(pickedItems => ValidationLibrary.evalIsEmpty(pickedItems) ? '' : pickedItems[0].ReturnValue);
    let notificationItemData = [];
    
    // Create Item Function
    let createItem = function(actionResult) {
        let data = JSON.parse(actionResult.data);

        let localItemNum = GenerateLocalID(context, `${data['@odata.readLink']}/Items`, 'ItemNumber', '0000', '', '');
        let sortNum = GenerateLocalID(context, `${data['@odata.readLink']}/Items`, 'ItemSortNumber', '0000', '', '');
        return Promise.all([localItemNum, sortNum]).then(function(promises) {
            let notificationItemCreateAction = '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCreate.action';
            return context.executeAction({'Name': notificationItemCreateAction, 'Properties': {
                'Properties':
                {
                    'NotificationNumber': data.NotificationNumber,
                    'ItemNumber' : promises[0],
                    'ItemText' : itemDescription,
                    'ObjectPartCodeGroup': objectPartCodeGroup,
                    'ObjectPart' : objectPart,
                    'CodeGroup': codeGroup,
                    'DamageCode': damageCode,
                    'ItemSortNumber': promises[1],
                },
                'Headers':
                {
                    'OfflineOData.RemoveAfterUpload': 'true',
                    'OfflineOData.TransactionID': data.NotificationNumber,
                },
                'CreateLinks':
                [{
                    'Property' : 'Notification',
                    'Target':
                    {
                        'EntitySet' : 'MyNotificationHeaders',
                        'ReadLink' : data['@odata.readLink'],
                    },
                }],
                'OnSuccess': '',
                'OnFailure': '',
            }});
        }).then(itemResult => {
            let itemData = JSON.parse(itemResult.data);
            const itemNote = context.evaluateTargetPath('#Control:CauseNote/#Value') ?? '';

            if (itemNote) {
                return context.executeAction({'Name': '/SAPAssetManager/Actions/Notes/NoteCreateDuringEntityCreate.action', 'Properties': {
                    'Target': {
                        'EntitySet': 'MyNotifItemLongTexts',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                    },
                    'Properties': {
                        'NewTextString': itemNote,
                        'TextString': itemNote,
                    },
                    'Headers': {
                        'OfflineOData.RemoveAfterUpload': 'true',
                    },
                    'OnSuccess': '',
                    'OnFailure': '',
                    'CreateLinks': [{
                        'Property': 'NotificationItem',
                        'Target': {
                            'EntitySet': 'MyNotificationItems',
                            'ReadLink': itemData['@odata.readLink'],
                        },
                    }],
                }}).then((itemNoteResult) => {
                    notificationItemData.push(JSON.parse(itemNoteResult?.data)['@odata.readLink']);
                    return itemResult;
                });
            } else {
                return Promise.resolve(itemResult);
            }
        });
    };

    // Create Cause function
    let createCause = function(actionResult) {
        let data = JSON.parse(actionResult.data);
        let localCauseNum = GenerateLocalID(context, `${data['@odata.readLink']}/ItemCauses`, 'CauseSequenceNumber', '0000', '', '');
        let sortNum = GenerateLocalID(context, `${data['@odata.readLink']}/ItemCauses`, 'CauseSortNumber', '0000', '', '');
        return Promise.all([localCauseNum, sortNum]).then(function(promises) {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseCreate.action',
                'Properties': {
                    'Properties':
                    {
                        'NotificationNumber': data.NotificationNumber,
                        'ItemNumber' : data.ItemNumber,
                        'CauseSequenceNumber' : promises[0],
                        'CauseText' : causeDescription,
                        'CauseCodeGroup': causeCodeGroup,
                        'CauseCode' : causeCode,
                        'CauseSortNumber' : promises[1],
                    },
                    'Headers':
                    {
                        'OfflineOData.RemoveAfterUpload': 'true',
                        'OfflineOData.TransactionID': data.NotificationNumber,
                    },
                    'CreateLinks':
                    [{
                        'Property' : 'Item',
                        'Target':
                        {
                            'EntitySet' : 'MyNotificationItems',
                            'ReadLink' : data['@odata.readLink'],
                        },
                    }],
                    'OnSuccess' : '',
                    'OnFailure' : '',
                },
            }).then(causeResult => {
                let causeData = JSON.parse(causeResult.data);
                const causeNote = context.evaluateTargetPath('#Control:CauseNote/#Value') ?? '';

                if (causeNote) {
                    return context.executeAction({'Name': '/SAPAssetManager/Actions/Notes/NoteCreateDuringEntityCreate.action', 'Properties': {
                        'Target': {
                            'EntitySet': 'MyNotifItemCauseLongTexts',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                        },
                        'Properties': {
                            'NewTextString': causeNote,
                            'TextString': causeNote,
                        },
                        'Headers': {
                            'OfflineOData.RemoveAfterUpload': 'true',
                        },
                        'OnSuccess': '',
                        'OnFailure': '',
                        'CreateLinks': [{
                            'Property': 'NotificationItemCause',
                            'Target': {
                                'EntitySet': 'MyNotificationItemCauses',
                                'ReadLink': causeData['@odata.readLink'],
                            },
                        }],
                    }}).then((causeNoteResult) => {
                        notificationItemData.push(JSON.parse(causeNoteResult?.data)['@odata.readLink']);
                        return causeResult;
                    });
                } else {
                    return Promise.resolve(causeResult);
                }
            });
        });
    };


    return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationUpdateMalfunctionEnd.action').then(actionResult => {
        try {
            notificationItemData.push(JSON.parse(actionResult?.data)['@odata.readLink']);
            if (itemDescription || (objectPartCodeGroup && objectPart) || (codeGroup && damageCode)) {
                // Create Item
                return createItem(actionResult);
            } else {
                // Resolve promise but don't pass an action result
                return Promise.resolve();
            }
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), 'MalfunctionEnd.js: Error in NotificationUpdateMalfunctionEnd action', err);
            return Promise.resolve();
        }   
    }).then(actionResult => {
        try {
            notificationItemData.push(JSON.parse(actionResult?.data)['@odata.readLink']);
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), 'MalfunctionEnd.js: Error in Notification Create Item action', err);
            return Promise.resolve();        
        }
        // If actionResult is null, no don't create a Cause
        if ((causeDescription || (causeCodeGroup && causeCode)) && actionResult ) {
            return createCause(actionResult);
        } else {
            return Promise.resolve();
        }
    }).then((actionResult) => {
        try {
            notificationItemData.push(JSON.parse(actionResult?.data)['@odata.readLink']);
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), 'MalfunctionEnd.js: Error in Notification Create Cause action', err);
            return Promise.resolve();
        } 
        // Update attachments -- Copied verbatim from DocumentCreateDelete.js because
        // the success message hardcoded into the rule screws things up

        //*************DELETE DOCUMENTS *********************/
        const attachmentFormcell = context.getControl('FormCellContainer').getControl('Attachment');
        const deletedAttachments = attachmentFormcell.getClientData().DeletedAttachments;
        // create an rray with all the readLinks to process
        context.getClientData().DeletedDocReadLinks = deletedAttachments.map((deletedAttachment) => {
            return deletedAttachment.readLink;
        });

        let deletes = deletedAttachments.map(() => {
            //call the delete doc delete action
            return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentDeleteBDS.action');
        });

        return Promise.all(deletes).then(() => {
        //*************CREATE DOCUMENTS *********************/
            const attachmentCount = DocLib.validationAttachmentCount(context);
            if (attachmentCount > 0) {
                return documentValidateCreate(context,'',attachmentFormcell);
            }
            return Promise.resolve();
        });
    }).then(() => {
        if (IsCompleteAction(context)) {
            let itemLinks = WorkOrderCompletionLibrary.getStep(context, 'notification').itemLinks || [];
            if (notificationItemData) {
                itemLinks = notificationItemData.concat(itemLinks);
            }
            WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                    data: JSON.stringify(context.binding),
                    value: context.localizeText('done'),
                    link: context.binding['@odata.editLink'],
                    itemLinks: itemLinks,
                });

                return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
        }
        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
    }).catch(() => {
        // Failure occurred
        return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
    });
}
