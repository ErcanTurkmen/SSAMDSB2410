import libCommon from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import ConstantsLibrary from '../Common/Library/ConstantsLibrary';
import Logger from '../Log/Logger';
import OffsetODataDate from '../Common/Date/OffsetODataDate';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
import WCMNotesLibrary from '../WCM/WCMNotes/WCMNotesLibrary';
import IsOperationLevelAssigmentType from '../WorkOrders/Operations/IsOperationLevelAssigmentType';
import IsSubOperationLevelAssigmentType from '../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import { WorkOrderDetailsPageName } from '../WorkOrders/Details/WorkOrderDetailsPageToOpen';
import { SubOperationDetailsPageName } from '../SubOperations/SubOperationDetailsPageToOpen';
import { NotificationDetailsPageName } from '../Notifications/Details/NotificationDetailsPageToOpen';
import { ServiceOrderDetailsPageName } from '../ServiceOrders/ServiceOrderDetailsPageToOpen';
import { ServiceItemDetailsPageName } from '../ServiceOrders/ServiceItems/ServiceItemDetailsPageToOpen';
import IsOnlineNotificationItem from '../OnlineSearch/Notifications/IsOnlineNotificationItem';

export class NoteLibrary {

    /**
     * Prepend a new note to existing note. If new text is empty, it returns back existing text
     * @param {IClientAPI} existingText
     * @param {string} newText
     */
    static prependNoteText(existingText, newText) {
        if (!libVal.evalIsEmpty(newText)) {
            let appendedText = existingText + '\n\n' + newText;
            return appendedText.trim();
        }
        return existingText;
    }

    /**
     * Triggered when the page is loaded
     * If a note exists then, display it in the text field
     * @param {*} pageClientAPI
     */
    static createUpdateOnPageLoad(pageClientAPI) {

        let noteTitle;
        //Determine if we are on edit vs. create in order to set the caption
        let onCreate = libCommon.IsOnCreate(pageClientAPI);
        // Set this title if we are adding note after rejection an operation
        let isOnRejectOp = libCommon.getStateVariable(pageClientAPI, 'IsOnRejectOperation');

        if (isOnRejectOp) {
            noteTitle = pageClientAPI.localizeText('reject_reason');
        } else if (onCreate) {
            noteTitle = pageClientAPI.localizeText('add_note');
        } else {
            noteTitle = pageClientAPI.localizeText('edit_note');
        }

        pageClientAPI.setCaption(noteTitle);
    }

    /**
     * Get note page caption
     * @param {*} pageClientAPI
     */
    static getCaption(pageClientAPI) {
        let caption = '';
        //Determine if we are on edit vs. create in order to set the caption
        let onCreate = libCommon.IsOnCreate(pageClientAPI);
        // Set this title if we are adding note after rejection an operation
        let isOnRejectOp = libCommon.getStateVariable(pageClientAPI, 'IsOnRejectOperation');

        if (isOnRejectOp) {
            caption = pageClientAPI.localizeText('reject_reason');
        } else if (onCreate) {
            caption = pageClientAPI.localizeText('add_note');
        } else {
            caption = pageClientAPI.localizeText('edit_note');
        }

        return caption;
    }

    /**
     * Download existing note
     * @param {*} pageClientAPI
     */
    static noteDownload(pageClientAPI, completionEntitySet, service = '/SAPAssetManager/Services/AssetManager.service') {
        let note;
        //clear the existing variable
        libCommon.setStateVariable(pageClientAPI, ConstantsLibrary.noteStateVariable, '');
        let entitySet = completionEntitySet || this.buildEntitySet(pageClientAPI);
        let filter = this.getFilter(pageClientAPI); //further filtering is needed for some note types

        //Read the existing note
        return pageClientAPI.read(service, entitySet, [], filter).then(result => {
            if (!libVal.evalIsEmpty(result)) {
                //Grab the first row
                note = result.getItem(0);
                libCommon.setStateVariable(pageClientAPI, ConstantsLibrary.noteStateVariable, note);
                return note;
            }
            return null;
        });
    }

    /**
     * Download existing note by params
     * @param {*} context
     * @param {String} noteEntitySet Entity set name
     * @param {String} queryOptions Query options
     */
    static noteDownloadByParams(context, noteEntitySet, queryOptions) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', noteEntitySet, [], queryOptions);
    }

    /**
     * Process the downloaded note, converting any time stamps to local time
     * and format to local time format for display
     * Timestapms are of the form 'YYYY-MM-DD HH:MM:SS XXX' where XXX is the timezone
     * Convert to YYYY-MM-DDTHH:MM:SS for Date object.  Subtract offset to account
     * for backend offset from GMT.
     * @param {*} pageClientAPI
     * @param {String?} noteEntitySet
     * @param {String?} queryOptions
     */
    static noteDownloadValue(pageClientAPI, noteEntitySet = '', queryOptions = '', onlineService = false) {
        let promise;

        if (libVal.evalIsEmpty(noteEntitySet)) {
            promise = this.noteDownload(pageClientAPI, undefined, `/SAPAssetManager/Services/${onlineService ? 'Online' : ''}AssetManager.service`);
        } else {
            promise = this.noteDownloadByParams(pageClientAPI, noteEntitySet, queryOptions).then(result => {
                if (!libVal.evalIsEmpty(result)) {
                    return result.getItem(0);
                }
                return null;
            });
        }

        return promise.then(note => {
            return this.getNoteText(pageClientAPI, note);
        }).catch(() => {
            //after creation of local equipment with local note inside it and then sync => read link is not updated correctly
            const binding = pageClientAPI.binding;
            if (binding) {
                const entitySet = `MyWorkOrderToolLongTexts(ItemCounter='${binding.ItemCounter}',OrderId='${binding.OrderId}',OperationNo='${binding.OperationNo}')`;
                return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', entitySet, []).then(result => {
                    if (!libVal.evalIsEmpty(result)) {
                        const note = result.getItem(0);
                        return this.getNoteText(pageClientAPI, note);
                    }
                    return '-';
                });
            }
            return '-';
        });
    }

    static getNoteText(pageClientAPI, note) {
        let noteText = note;
        if (noteText && noteText.TextString) {
            return noteText.TextString.replace(/\d{4}-[01]\d-[0-3]\d [0-2]\d:[0-5]\d:[0-5]\d [A-Z]{3}/g, function(match) {
                let dateStr = match.substr(0, match.length - 4).replace(' ', 'T');
                let date = new OffsetODataDate(pageClientAPI, dateStr);
                return pageClientAPI.formatDatetime(date.date());
            });
        }
        return '-';
    }

    /**
     * Build entity set depending on whether it's coming from the Error Archive or not
     * @param {*} pageClientAPI
     */
    static buildEntitySet(pageClientAPI) {
        let odataId;
        if (pageClientAPI.getPageProxy?.().getActionBinding?.()) {
            odataId = pageClientAPI.getPageProxy().getActionBinding()['@odata.id'];
        } else if (pageClientAPI.binding) {
            odataId = pageClientAPI.evaluateTargetPath('#Property:@odata.id');

            if (pageClientAPI.evaluateTargetPath('#Property:@odata.type') === '#sap_mobile.MeasuringPoint') {
                odataId = pageClientAPI.binding.WorkOrderTool[0]['@odata.id'];
            }
            if (pageClientAPI.evaluateTargetPath('#Property:@odata.type') === '#sap_mobile.S4ServiceOrderPartner') {
                odataId = pageClientAPI.binding.BusinessPartner_Nav['@odata.id'];
            }
        } else if (pageClientAPI.getPageProxy?.().getExecutedContextMenuItem?.()) {
            odataId = pageClientAPI.getPageProxy().getExecutedContextMenuItem().getBinding?.()['@odata.id'];
        }

        let transactionTypeObject = libCommon.getStateVariable(pageClientAPI, ConstantsLibrary.transactionNoteTypeStateVariable);

        if (odataId && odataId.includes(transactionTypeObject?.longTextEntitySet)) {
            return odataId;
        }

        // FromErrorArchive may be undefined on previous page's client data. evaluateTargetPath will throw an exception.
        try {
            let isFromErrorArchive = pageClientAPI.evaluateTargetPath('#Page:-Previous/#ClientData/#Property:FromErrorArchive');
            if (transactionTypeObject.component) {
                return odataId + (isFromErrorArchive ? '' : '/' + transactionTypeObject.component);
            } else {
                return odataId;
            }
        } catch (exc) {
            if (transactionTypeObject.component) {
                return odataId + '/' + transactionTypeObject.component;
            } else {
                return odataId;
            }
        }
    }

    /**
     * Get OData filter for this note type
     * @param {*} pageClientAPI
     */
    static getFilter(pageClientAPI) {
        let filter = '';
        let transactionTypeObject = libCommon.getStateVariable(pageClientAPI, ConstantsLibrary.transactionNoteTypeStateVariable);
        if (transactionTypeObject.filter) {
            filter = transactionTypeObject.filter;
        }
        return filter;
    }

    /**
     * set the noteType state variable
     * @param {IClientAPI} clientAPI
     * @param {string} noteType
     */
    static setNoteTypeTransactionFlag(clientAPI, noteType) {
        if (noteType) {
            libCommon.setStateVariable(clientAPI, ConstantsLibrary.transactionNoteTypeStateVariable, noteType);
        } else {
            //empty
            libCommon.setStateVariable(clientAPI, ConstantsLibrary.transactionNoteTypeStateVariable, '');
        }
    }

    /**
     * Validates if Note Type control has a value
     * @param {ClientAPI} context 
     * @returns {boolean}
     */
    static validateNoteFieldValue(context) {
        const noteControl = libCommon.getControlProxy(context, 'LongTextNote');
        noteControl.clearValidation();

        if (!libCommon.getControlValue(noteControl)) {
            libCommon.executeInlineControlError(context, noteControl, context.localizeText('field_is_required'));
            return false;
        }

        return true;
    }

    static didSetNoteTypeTransactionForBindingType(clientAPI, customBinding = undefined) {
        let page = libCommon.getPageName(clientAPI);
        if (page === 'MeasuringPointDetailsPage') {
            clientAPI._context.binding = clientAPI.getPageProxy().binding.WorkOrderTool[0];
        }
        if (page === 'FieldServiceOverview') {
            if (IsOperationLevelAssigmentType(clientAPI)) {
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workOrderOperation(clientAPI, page, customBinding));
            } else if (IsSubOperationLevelAssigmentType(clientAPI)) {
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workOrderSubOperation(page));
            } else {
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workOrder(page));
            }
            return true;
        }
        let binding = customBinding || libCommon.getBindingObject(clientAPI);
        let bindingType = binding['@odata.type'];

        if (!bindingType) {
            return false;
        }

        let startIndex = bindingType.lastIndexOf('.') + 1;

        const operationalItem = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentItem.global').getValue().split('.')[1];
        const workApproval = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApproval.global').getValue().split('.')[1];
        const workPermit = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue().split('.')[1];
        const safCertificate = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue().split('.')[1];

        switch (bindingType.substr(startIndex)) {
            case 'MyWorkOrderTool':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.prt(page));
                break;
            case 'MyWorkOrderHeader':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workOrder(page));
                break;
            case 'MyWorkOrderOperation':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workOrderOperation(clientAPI, page, binding));
                break;
            case 'MyWorkOrderSubOperation':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workOrderSubOperation(page));
                break;
            case 'MyNotificationHeader':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notification(page));
                break;
            case 'MyNotificationTask':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationTask(page));
                break;
            case 'MyNotificationActivity':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationActivity());
                break;
            case 'MyNotificationItem':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItem());
                break;
            case 'MyNotificationItemTask':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItemTask());
                break;
            case 'MyNotificationItemActivity':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItemActivity());
                break;
            case 'MyNotificationItemCause':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItemCause());
                break;
            case 'MyWorkOrderComponent':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.part());
                break;
            case 'S4ServiceItem':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceItem(page));
                break;
            case 'S4ServiceOrder':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceOrder(page));
                break;
            case 'S4ServiceRequest':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceRequest());
                break;
            case 'S4ServiceConfirmation':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceConfirmation());
                break;
            case 'S4ServiceConfirmationItem':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceConfirmationItem());
                break;
            case operationalItem:
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.operationalItem(clientAPI));
                break;
            case workApproval:
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workApproval(clientAPI));
                break;
            case safCertificate:
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.safetyCertificate(clientAPI));
                break;
            case workPermit:
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workPermit(clientAPI));
                break;
            case 'S4ServiceOrderLongText':
                //The S4 Notes list page can be opened for service items 
                //If notes refer to a service item, the binding will have a non-empty ItemNo and does not contain all zeros
                if (binding?.ItemNo && binding?.ItemNo !== '000000') {
                    this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceOrderItemLongText(clientAPI));
                } else {
                    this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceOrderLongText(clientAPI));
                }
                break;
            case 'S4ServiceRequestLongText':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceRequestLongText(clientAPI));
                break;
            case 'S4ServiceConfirmationLongText':
                //The S4 Notes list page can be opened for service confirmation items 
                //If notes refer to a service confirmation item, the binding will have a non-empty ItemNo and does not contain all zeros
                if (binding?.ItemNo && binding?.ItemNo !== '000000') {
                    this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceConfirmationItemLongText(clientAPI));
                } else {
                    this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceConfirmationLongText(clientAPI));
                }
                break;
            case 'S4BusinessPartner':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.s4BusinessPartner(clientAPI, page));
                    break;
            case 'S4BusinessPartnerLongText':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.s4BusinessPartnerLongText(clientAPI));
                    break;
            case 'S4ServiceQuotation':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceQuotation());
                break;
            case 'S4ServiceQuotationLongText':
                if (binding?.ItemNo && binding?.ItemNo !== '000000') {
                    this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceQuotationItemLongText(clientAPI));
                } else {
                    this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceQuotationLongText(clientAPI));
                }
                break;
            case 'S4ServiceQuotationItem':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceQuotationItem());
                break;
            default:
                // Didn't set the transaction type
                return false;
        }

        return true;
    }

    /**
     * Helper method for setting Note Type Transaction Flag based on page name
     * @param {*} clientAPI
     * @param {*} page
     */
    static didSetNoteTypeTransactionFlagForPage(clientAPI, page) {
        switch (page) {
            case 'MeasuringPointDetailsPage':
            case 'PRTMaterialDetailsPage':
            case 'PRTEquipmentDetailsPage':
            case 'PRTMiscellaneousDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.prt(page));
                break;
            case WorkOrderDetailsPageName(clientAPI):
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workOrder(page));
                break;
            case 'WorkOrderOperationDetailsPage':
            case 'WorkOrderOperationDetailsWithObjectCards':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workOrderOperation(clientAPI, page));
                break;
            case SubOperationDetailsPageName(clientAPI):
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workOrderSubOperation(page));
                break;
            case NotificationDetailsPageName(clientAPI):
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notification(page));
                break;
            case 'NotificationTaskDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationTask(page));
                break;
            case 'NotificationActivityDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationActivity());
                break;
            case 'NotificationItemDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItem());
                break;
            case 'NotificationItemTaskDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItemTask());
                break;
            case 'NotificationItemActivityDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItemActivity());
                break;
            case 'NotificationItemCauseDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItemCause());
                break;
            case 'PartDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.part());
                break;
            case 'FunctionalLocationDetails':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.funcloc());
                break;
            case 'EquipmentDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.equipment());
                break;
            case 'PurchaseOrderDetails':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.purchaseOrder(clientAPI));
                break;
            case 'CreateUpdateServiceItemScreen':
            case ServiceItemDetailsPageName(clientAPI):
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceItem(page));
                break;
            case ServiceOrderDetailsPageName(clientAPI):
            case 'ServiceOrderCreateUpdatePage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceOrder(page));
                break;
            case 'ServiceQuotationCreateUpdatePage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceQuotation(page));
                break;
            case 'ServiceRequestDetailsPage':
            case 'ServiceRequestCreateUpdatePage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceRequest());
                break;
            case 'CreateUpdateServiceConfirmationScreen':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceConfirmation());
                break;
            case 'OperationalItemDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.operationalItem(clientAPI));
                break;
            case 'WorkApprovalDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workApproval(clientAPI));
                break;
            case 'WorkPermitDetails':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workPermit(clientAPI));
                break;
            case 'SafetyCertificateDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.safetyCertificate(clientAPI));
                break;
            case 'ConfirmationsDetailsScreenPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceConfirmation());
                break;
            case 'ConfirmationsItemDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceConfirmationItem());
                break;
            case 'OnlineEquipmentDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.onlineEquipment());
                break;
            case 'OnlineFunctionalLocationDetails':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.onlineFunctionalLocation());
                break;
            case 'OnlineWorkOrderDetails':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.onlineWorkOrder());
                break;
            case 'OnlinePartDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.onlinePart());
                break;
            case 'OnlineNotificationDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.onlineNotification());
                break;
            case 'AddS4BusinessPartnerPage':
            case 'BusinessPartnerDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.s4BusinessPartner(clientAPI, page));
                break;
            case 'OnlineNotificationItemCauseDetailsPage': 
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.onlineNotificationItemCause());
                break;
            case 'OnlineNotificationItemDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.onlineNotificationItem());
                break;
            case 'OnlineNotificationItemActivityDetailsPage':
                if (IsOnlineNotificationItem(clientAPI)) {
                    this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.onlineNotificationItemActivity());
                } else {
                    this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.onlineNotificationActivity());
                }
                break;
            case 'OnlineNotificationItemTaskDetailsPage':
                if (IsOnlineNotificationItem(clientAPI)) {
                    this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.onlineNotificationItemTask());
                } else {
                    this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.onlineNotificationTask());
                }
                break;
            case 'CreateUpdateServiceQuotationItem': 
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.serviceQuotationItem());
                break;
            case 'OnlineWorkOrderOperationDetailsWithObjectCards':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.onlineWorkOrderOperationDetailsWithObjectCards());
                break;
            default:
                // Didn't set the transaction type
                return false;
        }
        return true;
    }

    /**
     * get the noteType state variable
     * @param {IClientAPI} clientAPI
     */
    static getNoteTypeTransactionFlag(clientAPI) {
        const noteTypeTransactionFlag = libCommon.getStateVariable(clientAPI, ConstantsLibrary.transactionNoteTypeStateVariable);

        try {
            if (clientAPI.evaluateTargetPath('#Property:@odata.type') === '#sap_mobile.MeasuringPoint') {
                clientAPI._context.binding = clientAPI.getPageProxy().binding.WorkOrderTool[0];
            }

            return noteTypeTransactionFlag;
        } catch (e) {
            return noteTypeTransactionFlag;
        }
    }

    /**
     * Get the note component for a given page
     * @param {*} clientAPI
     * @param {*} page
     */
    static getNoteComponentForPage(clientAPI, page) {
        if (this.didSetNoteTypeTransactionFlagForPage(clientAPI, page)) {
            return this.getNoteTypeTransactionFlag(clientAPI).component;
        }
        return '';
    }

    /**
     * Creates the link between the Long text entity set with the parent entity set.
     * @param {ISectionProxy | IPageProxy | IControlProxy} context Could be SectionProxy, PageProxy, ControlProxy, etc.
     */
    static createLinks(context) {
        const createLinks = [];
        let onChangeSet = libCommon.isOnChangeset(context);
        let objectType = this.getNoteTypeTransactionFlag(context);

        if (context.binding?.['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
            //We are creating a new note for a new notification by recording a defect from EAM Checklist.
            //The new notification has previously been saved in the 'CreateNotification' state variable.
            let notifObj = libCommon.getStateVariable(context, 'CreateNotification');
            if (libCommon.isDefined(notifObj['@odata.readLink'])) {
                //Adding a note after the business object is created
                let noteCreateLink = context.createLinkSpecifierProxy(objectType.name, objectType.entitySet, '', notifObj['@odata.readLink']);
                createLinks.push(noteCreateLink.getSpecifier());
            }
        } else if (onChangeSet) {
            // On the Workorder Create or similar changeset
            let currentCounter = libCommon.getCurrentChangeSetActionCounter(context);
            let noteCreateLink = context.createLinkSpecifierProxy(objectType.name, objectType.entitySet, '', 'pending_' + currentCounter);
            createLinks.push(noteCreateLink.getSpecifier());
        } else if (libCommon.getStateVariable(context, 'contextMenuSwipePage')) {
            let bindingObj = libCommon.getBindingObject(context);
            let noteCreateLink = context.createLinkSpecifierProxy(objectType.name, objectType.entitySet, '', bindingObj['@odata.readLink']);
            createLinks.push(noteCreateLink.getSpecifier());
        } else {
            //Adding a note after the business object is created
            let readLink = '';
            if (objectType.page === 'MeasuringPointDetailsPage') {
                readLink = context.evaluateTargetPath('#Page:-Previous/#Property:@odata.readLink');
            } else if (objectType.entitySetLink) {
                readLink = objectType.entitySetLink;
            } else if (context.binding?.['@odata.editLink'] && IsCompleteAction(context)) {
                // We are adding this condition to allow the user to update the confirmation note while completing the operation.
                // As we are assigning a value from the 'time' variable in the openTimeEntryPage() function in ChangeTime.js,
                // the readLink is 'pending_1' instead of the actual confirmation readLink.
                readLink = context.binding['@odata.editLink'];
            } else if (IsCompleteAction(context)) {
                readLink = WorkOrderCompletionLibrary.getInstance().getBinding(context)['@odata.readLink'];
            } else {
                readLink = context.evaluateTargetPath('#Page:' + objectType.page + '/#Property:@odata.readLink');
            }
            let noteCreateLink = context.createLinkSpecifierProxy(objectType.name, objectType.entitySet, '', readLink);
            createLinks.push(noteCreateLink.getSpecifier());
        }

        return createLinks;
    }

    /**
     * Gets the correct entity set from the saved state variable
     * @param {*} context Could be SectionProxy, PageProxy, ControlProxy, etc.
     */
    static getEntitySet(context) {
        return this.getNoteTypeTransactionFlag(context).longTextEntitySet;
    }

    /**
     * Refresh the parent details page and run toast message after note save
     * @param {*} proxyAPI Could be SectionProxy, PageProxy, ControlProxy, etc.
     */
    static createSuccessMessage(proxyAPI) {
        try {
            let objectType = this.getNoteTypeTransactionFlag(proxyAPI);
            let pageProxy = proxyAPI.evaluateTargetPathForAPI('#Page:' + objectType.page);
            let controls = pageProxy.getControls();
            for (let control of controls) {
                control.redraw();
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(proxyAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotes.global').getValue(), 'Note createSuccessMessage Error: ' + err);
        }
        ExecuteActionWithAutoSync(proxyAPI, '/SAPAssetManager/Actions/Notes/NoteCreateSuccessMessage.action');
    }
}

/**
 * This class stores all of the possible Note Types.
 * When referencing a note type, please use the following class.
 */
export class TransactionNoteType {
    static workOrder(page) {
        return {
            component: 'HeaderLongText',
            name: 'WorkOrderHeader',
            entitySet: 'MyWorkOrderHeaders',
            longTextEntitySet: 'MyWorkOrderHeaderLongTexts',
            page: page,
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnWO.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnWO.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnWO.action',
        };
    }

    static prt(page) {
        return {
            component: 'WOToolLongText_Nav',
            name: 'WOTool_Nav',
            entitySet: 'MyWorkOrderTools',
            longTextEntitySet: 'MyWorkOrderToolLongTexts',
            page: page,
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnPRT.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnPRT.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnPRT.action',
        };
    }

    static workOrderOperation(context, page, binding = context.binding) {
        return {
            component: 'OperationLongText',
            name: 'WorkOrderOperation',
            entitySet: 'MyWorkOrderOperations',
            entitySetLink: `MyWorkOrderOperations(OrderId='${binding?.OrderId}',OperationNo='${binding?.OperationNo}')`,
            longTextEntitySet: 'MyWorkOrderOperationLongTexts',
            page: page,
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnWOOperation.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnWOOperation.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnWOOperation.action',
        };
    }

    static workOrderSubOperation(page) {
        return {
            component: 'SubOperationLongText',
            name: 'WorkOrderSubOperation',
            entitySet: 'MyWorkOrderSubOperations',
            longTextEntitySet: 'MyWorkOrderSubOpLongTexts',
            page: page,
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnWOSubOperation.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnWOSubOperation.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnWOSubOperation.action',
        };
    }

    static part() {
        return {
            component: 'ComponentLongText',
            name: 'WorkOrderComponent',
            entitySet: 'MyWorkOrderComponents',
            longTextEntitySet: 'MyWorkOrderComponentLongTexts',
            page: 'PartDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnParts.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnParts.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnParts.action',

        };
    }
        
    static onlinePart() {
        return {
            component: 'LongText',
            name: 'Component',
            entitySet: 'Components',
            longTextEntitySet: 'ComponentLongTexts',
            page: 'OnlinePartDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnParts.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnParts.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnParts.action',

        };
    }

    static notification(page) {
        return {
            component: 'HeaderLongText',
            name: 'Notification',
            entitySet: 'MyNotificationHeaders',
            longTextEntitySet: 'MyNotifHeaderLongTexts',
            page: page,
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Notifications/NoteCreateDuringNotificationCreate.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotificationNoteUpdate.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotificationNoteDelete.action',

        };
    }

    static notificationItem() {
        return {
            component: 'ItemLongText',
            name: 'NotificationItem',
            entitySet: 'MyNotificationItems',
            longTextEntitySet: 'MyNotifItemLongTexts',
            page: 'NotificationItemDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Notifications/NoteCreateDuringNotificationItemCreate.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotificationItemNoteUpdate.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotificationItemNoteDelete.action',

        };
    }

    static notificationTask(page) {
        return {
            component: 'TaskLongText',
            name: 'NotificationTask',
            entitySet: 'MyNotificationTasks',
            longTextEntitySet: 'MyNotifTaskLongTexts',
            page: page || 'NotificationTaskDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Notifications/NoteCreateDuringNotificationTaskCreate.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotificationTaskNoteUpdate.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotificationTaskNoteDelete.action',

        };
    }

    static notificationActivity() {
        return {
            component: 'ActivityLongText',
            name: 'NotificationActivity',
            entitySet: 'MyNotificationActivities',
            longTextEntitySet: 'MyNotifActivityLongTexts',
            page: 'NotificationActivityDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Notifications/NoteCreateDuringNotificationActivityCreate.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotificationActivityNoteUpdate.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotificationActivityNoteDelete.action',

        };
    }

    static notificationItemActivity() {
        return {
            component: 'ItemActivityLongText',
            name: 'NotificationItemActivity',
            entitySet: 'MyNotificationItemActivities',
            longTextEntitySet: 'MyNotifItemActivityLongTexts',
            page: 'NotificationItemActivityDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Notifications/NoteCreateDuringNotificationItemActivityCreate.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotificationItemActivityNoteUpdate.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotificationItemActivityNoteDelete.action',

        };
    }

    static notificationItemCause() {
        return {
            component: 'ItemCauseLongText',
            name: 'NotificationItemCause',
            entitySet: 'MyNotificationItemCauses',
            longTextEntitySet: 'MyNotifItemCauseLongTexts',
            page: 'NotificationItemCauseDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Notifications/NoteCreateDuringNotificationItemCauseCreate.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotificationItemCauseNoteUpdate.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotificationItemCauseNoteDelete.action',

        };
    }

    static notificationItemTask() {
        return {
            component: 'ItemTaskLongText',
            name: 'NotificationItemTask',
            entitySet: 'MyNotificationItemTasks',
            longTextEntitySet: 'MyNotifItemTaskLongTexts',
            page: 'NotificationItemTaskDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Notifications/NoteCreateDuringNotificationItemTaskCreate.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotificationItemTaskNoteUpdate.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotificationItemTaskNoteDelete.action',

        };
    }

    static workOrderHistory() {
        return {
            component: 'HistoryLongText',
            name: 'WorkOrderHistory',
            entitySet: 'WorkOrderHistories',
            longTextEntitySet: 'WorkOrderHistoryTexts',
            page: 'EquipmentDetailsPage',
        };
    }

    static confirmation() {
        return {
            component: 'LongText',
            name: 'Confirmation',
            entitySet: 'Confirmations',
            longTextEntitySet: 'ConfirmationLongTexts',
            page: 'ConfirmationDetailsPage',
        };
    }

    static mileage() {
        return {
            component: 'LongText',
            name: 'Confirmation',
            entitySet: 'Confirmations',
            longTextEntitySet: 'ConfirmationLongTexts',
            page: 'ServiceOrderMileageAddEdit',
        };
    }

    static funcloc() {
        return {
            component: 'FuncLocLongText_Nav',
            name: 'MyFunctionalLocation',
            entitySet: 'MyFunctionalLocations',
            longTextEntitySet: 'MyFuncLocLongTexts',
            page: 'FunctionalLocationDetails',
        };
    }

    static equipment() {
        return {
            component: 'EquipmentLongText_Nav',
            name: 'MyEquipment',
            entitySet: 'MyEquipments',
            longTextEntitySet: 'MyEquipLongTexts',
            page: 'EquipmentDetails',
        };
    }

    static purchaseOrder(context) {
        return {
            component: 'PurchaseOrderHeaderLongText_Nav',
            name: 'PurchaseOrderHeader',
            entitySet: 'PurchaseOrderHeaders',
            longTextEntitySet: 'PurchaseOrderHeaderLongTexts',
            page: 'PurchaseOrderDetailsPage',
            filter: "$filter=ObjectKey eq '" + context.binding.PurchaseOrderId + "' and TextObjType eq 'EKKO'",
        };
    }

    static serviceItem(page) {
        return {
            component: 'LongText_Nav',
            name: 'S4ServiceItem_Nav',
            entitySet: 'S4ServiceItems',
            longTextEntitySet: 'S4ServiceOrderLongTexts',
            page: page,
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnServiceItem.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnServiceItem.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnServiceItem.action',
        };
    }

    static serviceOrder(page) {
        return {
            component: 'LongText_Nav',
            name: 'S4ServiceOrder_Nav',
            entitySet: 'S4ServiceOrders',
            longTextEntitySet: 'S4ServiceOrderLongTexts',
            page: page,
            ...s4NoteActions,
        };
    }

    static operationalItem(context) {
        const binding = WCMNotesLibrary.getObjectBinding(context);

        return {
            component: WCMNotesLibrary.getNotesEntitySet(context, true),
            name: 'WCMDocumentItems',
            entitySet: 'WCMDocumentItems',
            longTextEntitySet: WCMNotesLibrary.getLongTextEntitySet(context),
            page: 'OperationalItemDetailsPage',
            filter: WCMNotesLibrary.getNoteQueryOptions(context),
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnWCMObject.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnWCMObject.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnWCMObject.action',
            noteCreateActionProperties: {
                Properties: {
                    TextObject: 'WCDOCITM',
                    WCMDocument: binding.WCMDocument,
                    WCMDocumentItem: binding.WCMDocumentItem,
                },
            },
        };
    }

    static workApproval(context) {
        const binding = WCMNotesLibrary.getObjectBinding(context);

        return {
            component: WCMNotesLibrary.getNotesEntitySet(context, true),
            name: 'WCMApprovals',
            entitySet: 'WCMApprovals',
            longTextEntitySet: WCMNotesLibrary.getLongTextEntitySet(context),
            page: 'WorkApprovalDetailsPage',
            filter: WCMNotesLibrary.getNoteQueryOptions(context),
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnWCMObject.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnWCMObject.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnWCMObject.action',
            noteCreateActionProperties: {
                Properties: {
                    TextObject: 'WAP',
                    WCMApproval: binding.WCMApproval,
                },
            },
        };
    }

    static workPermit(context) {
        const binding = WCMNotesLibrary.getObjectBinding(context);

        return {
            component: WCMNotesLibrary.getNotesEntitySet(context, true),
            name: 'WCMApplication_Nav',
            entitySet: 'WCMApplications',
            longTextEntitySet: WCMNotesLibrary.getLongTextEntitySet(context),
            page: 'WorkPermitDetails',
            filter: WCMNotesLibrary.getNoteQueryOptions(context),
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnWCMObject.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnWCMObject.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnWCMObject.action',
            noteCreateActionProperties: {
                Properties: {
                    TextObject: 'WAPI',
                    Application: binding.WCMApplication,
                },
            },
        };
    }

    static safetyCertificate(context) {
        const binding = WCMNotesLibrary.getObjectBinding(context);

        return {
            component: WCMNotesLibrary.getNotesEntitySet(context, true),
            name: 'WCMDocumentHeaders',
            entitySet: 'WCMDocumentHeaders',
            longTextEntitySet: WCMNotesLibrary.getLongTextEntitySet(context),
            page: 'SafetyCertificateDetailsPage',
            filter: WCMNotesLibrary.getNoteQueryOptions(context),
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnWCMObject.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnWCMObject.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnWCMObject.action',
            noteCreateActionProperties: {
                Properties: {
                    TextObject: 'WCDOC',
                    WCMDocument: binding.WCMDocument,
                },
            },
        };
    }

    static serviceConfirmation() {
        return {
            component: 'LongText_Nav',
            name: 'S4ServiceConfirmation_Nav',
            entitySet: 'S4ServiceConfirmations',
            longTextEntitySet: 'S4ServiceConfirmationLongTexts',
            page: 'ConfirmationsDetailsScreenPage',
            ...s4NoteActions,
        };
    }

    static serviceConfirmationItem() {
        return {
            component: 'LongText_Nav',
            name: 'S4ServiceConfirmationItem_Nav',
            entitySet: 'S4ServiceConfirmationItems',
            longTextEntitySet: 'S4ServiceConfirmationLongTexts',
            page: 'ConfirmationsItemDetailsPage',
            ...s4NoteActions,
        };
    }

    static serviceRequest() {
        return {
            component: 'LongText_Nav',
            name: 'S4ServiceRequest_Nav',
            entitySet: 'S4ServiceRequests',
            longTextEntitySet: 'S4ServiceRequestLongTexts',
            page: 'ServiceRequestDetailsPage',
            ...s4NoteActions,
        };
    }

    static onlineEquipment() {
        return {
            component: 'LongText',
            entitySet: 'Equipments',
            longTextEntitySet: 'EquipmentLongTexts',
            page: 'OnlineEquipmentDetailsPage',
        };
    }

    static onlineFunctionalLocation() {
        return {
            component: 'FuncLocLongText',
            entitySet: 'FunctionalLocations',
            longTextEntitySet: 'FuncLocDocuments',
            page: 'OnlineFunctionalLocationDetails',
        };
    }

    static onlineNotification() {
        return {
            component: 'HeaderLongText',
            entitySet: 'NotificationHeaders',
            longTextEntitySet: 'NotifHeaderLongTexts',
            page: 'OnlineNotificationDetailsPage',
        };
    }

    static onlineNotificationItemCause() {
        return {
            component: 'ItemCauseLongText',
            entitySet: 'NotificationItemCauses',
            longTextEntitySet: 'NotifItemCauseLongTexts',
            page: 'OnlineNotificationItemCauseDetailsPage',
        }; 
    }

    static onlineNotificationItem() {
        return {
            component: 'ItemLongText',
            entitySet: 'NotificationItems',
            longTextEntitySet: 'NotifItemLongTexts',
            page: 'OnlineNotificationItemDetailsPage',
        }; 
    }

    static onlineNotificationItemActivity() {
        return {
            component: 'ItemActivityLongText',
            entitySet: 'NotificationItemActivities',
            longTextEntitySet: 'NotifItemActivityLongTexts',
            page: 'OnlineNotificationItemActivityDetailsPage',
        }; 
    }

    static onlineNotificationActivity() {
        return {
            component: 'ActivityLongText',
            entitySet: 'NotificationActivities',
            longTextEntitySet: 'NotifActivityLongTexts',
            page: 'OnlineNotificationItemActivityDetailsPage',
        }; 
    }

    static onlineNotificationItemTask() {
        return {
            component: 'ItemTaskLongText',
            entitySet: 'NotificationItemTasks',
            longTextEntitySet: 'NotifItemTaskLongTexts',
            page: 'OnlineNotificationItemTaskDetailsPage',
        };  
    }

    static onlineNotificationTask() {
        return {
            component: 'TaskLongText',
            entitySet: 'NotificationTasks',
            longTextEntitySet: 'NotifTaskLongTexts',
            page: 'OnlineNotificationItemTaskDetailsPage',
        };  
    }

    static onlineWorkOrder() {
        return {
            component: 'LongText',
            entitySet: 'WorkOrderHeaders',
            longTextEntitySet: 'LongText',
            page: 'OnlineWorkOrderDetails',
        };
    }

    static onlineWorkOrderOperationDetailsWithObjectCards() {
        return {
            component: 'LongText',
            entitySet: 'WorkOrderOperation',
            longTextEntitySet: 'LongText',
            page: 'onlineWorkOrderOperationDetailsWithObjectCards',
        };
    }

    static serviceOrderLongText(clientAPI) {
        return {
            component: '',
            name: 'S4ServiceOrder_Nav',
            entitySet: 'S4ServiceOrders',
            entitySetLink: `S4ServiceOrders(ObjectID='${clientAPI.binding.ObjectID}',ObjectType='${clientAPI.binding.ObjectType}')`,
            longTextEntitySet: 'S4ServiceOrderLongTexts',
            page: 'NotesListView',
            ...s4NoteActions,
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDelete.action',
        };
    }

    static serviceOrderItemLongText(clientAPI) {
        return {
            component: '',
            name: 'S4ServiceItem_Nav',
            entitySet: 'S4ServiceItems',
            entitySetLink: `S4ServiceItems(ObjectID='${clientAPI.binding.ObjectID}',ObjectType='${clientAPI.binding.ObjectType}',ItemNo='${clientAPI.binding.ItemNo}')`, 
            longTextEntitySet: 'S4ServiceOrderLongTexts',
            page: 'NotesListView',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnServiceItem.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnServiceItem.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDelete.action',
        };
    }

    static serviceConfirmationLongText(clientAPI) {
        return {
            component: '',
            name: 'S4ServiceConfirmation_Nav',
            entitySet: 'S4ServiceConfirmations',
            entitySetLink: `S4ServiceConfirmations(ObjectID='${clientAPI.binding.ObjectID}',ObjectType='${clientAPI.binding.ObjectType}')`,
            longTextEntitySet: 'S4ServiceConfirmationLongTexts',
            page: 'NotesListView',
            ...s4NoteActions,
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDelete.action',
        };
    }

    static serviceConfirmationItemLongText(clientAPI) {
        return {
            component: '',
            name: 'S4ServiceConfirmationItem_Nav',
            entitySet: 'S4ServiceConfirmationItems',
            entitySetLink: `S4ServiceConfirmationItems(ObjectID='${clientAPI.binding.ObjectID}',ObjectType='${clientAPI.binding.ObjectType}',ItemNo='${clientAPI.binding.ItemNo}')`, 
            longTextEntitySet: 'S4ServiceConfirmationLongTexts',
            page: 'NotesListView',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnServiceItem.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDelete.action',
        };
    }

    static serviceRequestLongText(clientAPI) {
        return {
            component: '',
            name: 'S4ServiceRequest_Nav',
            entitySet: 'S4ServiceRequests',
            entitySetLink: `S4ServiceRequests(ObjectID='${clientAPI.binding.ObjectID}',ObjectType='${clientAPI.binding.ObjectType}')`,
            longTextEntitySet: 'S4ServiceRequestLongTexts',
            page: 'NotesListView',
            ...s4NoteActions,
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDelete.action',
        };
    }
    
    static s4BusinessPartner(clientAPI, page) {
        const binding = clientAPI.binding;

        return {
            component: 'S4BusinessPartnerLongText_Nav',
            name: 'S4BusinessPartner_Nav',
            entitySet: 'S4BusinessPartners',
            longTextEntitySet: 'S4BusinessPartnerLongTexts',
            entitySetLink: `S4BusinessPartners('${binding?.BusinessPartnerID || binding?.BPNum || binding?.BusinessPartner_Nav?.BPNum}')`,
            page,
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnBP.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnBP.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDelete.action',
        };
    }

    static s4BusinessPartnerLongText(clientAPI) {
        const binding = clientAPI.binding;

        return {
            component: '',
            name: 'S4BusinessPartner_Nav',
            entitySet: 'S4BusinessPartners',
            entitySetLink: `S4BusinessPartners('${binding?.BusinessPartnerID || binding?.BPNum || binding?.BusinessPartner_Nav?.BPNum}')`,
            longTextEntitySet: 'S4BusinessPartnerLongTexts',
            page: 'BPNotesListView',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnBP.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnBP.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDelete.action',
        };
    }

    static serviceQuotation() {
        return {
            component: 'LongText_Nav',
            name: 'S4ServiceQuotation_QuotText_Nav',
            entitySet: 'S4ServiceQuotations',
            longTextEntitySet: 'S4ServiceQuotationLongTexts',
            page: 'ServiceQuotationDetails',
            ...s4NoteActions,
        };
    }

    static serviceQuotationLongText(clientAPI) {
        return {
            component: '',
            name: 'S4ServiceQuotation_QuotText_Nav',
            entitySet: 'S4ServiceQuotations',
            entitySetLink: `S4ServiceQuotations(ObjectID='${clientAPI.binding.ObjectID}',ObjectType='${clientAPI.binding.ObjectType}')`,
            longTextEntitySet: 'S4ServiceQuotationLongTexts',
            page: 'NotesListView',
            ...s4NoteActions,
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDelete.action',
        };
    }

    static serviceQuotationItem() {
        return {
            component: 'LongText_Nav',
            name: 'S4ServiceQuotItem_QuotText_Nav',
            entitySet: 'S4ServiceQuotationItems',
            longTextEntitySet: 'S4ServiceQuotationLongTexts',
            page: 'S4ServiceQuotationItemDetails',
            ...s4NoteActions,
        };
    }

    static serviceQuotationItemLongText(clientAPI) {
        return {
            component: '',
            name: 'S4ServiceQuotItem_QuotText_Nav',
            entitySet: 'S4ServiceQuotationItems',
            entitySetLink: `S4ServiceQuotationItems(ItemNo='${clientAPI.binding.ItemNo}',ObjectID='${clientAPI.binding.ObjectID}',ObjectType='${clientAPI.binding.ObjectType}')`, 
            longTextEntitySet: 'S4ServiceQuotationLongTexts',
            page: 'NotesListView',
            ...s4NoteActions,
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDelete.action',
        };
    }
}

const s4NoteActions = {
    noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnSO.action',
    noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnSO.action',
    noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnSO.action',
};
