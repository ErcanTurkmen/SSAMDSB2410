import ComLib from '../Common/Library/CommonLibrary';
import DocLib from './DocumentLibrary';
import Logger from '../Log/Logger';
import { WorkOrderLibrary as libWo } from '../WorkOrders/WorkOrderLibrary';
import NotifLib from '../Notifications/NotificationLibrary';
import DocumentPath from './DocumentPath';
import Base64Library from '../Common/Library/Base64Library';
import IsAndroid from '../Common/IsAndroid';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import NativeScriptObject from '../Common/Library/NativeScriptObject';
import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';

export default class {
    /**
     * Checks to see if the work order from context is marked or not.
     * @param {*} clientAPI
     * @return {Promise} a promise of true if media is local.
     *
     * @memberof DocumentEventLibrary
     */
    static isMediaLocal(clientAPI, path) {
        let binding = clientAPI.binding;

        let objectType;
        if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
            objectType = binding.PRTDocument.ObjectType;
        } else {
            objectType = binding.Document.ObjectType;
        }

        if (objectType === 'URL') {
            // Special case for URL documents: always assume media is "local"
            return Promise.resolve(true);
        } else {
            const readLink = ComLib.getTargetPathValue(clientAPI, path);
            const entitySet = readLink.split('(')[0];
            /**Implementing our Logger class*/
            Logger.debug(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), readLink);
            Logger.debug(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), entitySet);
            return clientAPI.isMediaLocal('/SAPAssetManager/Services/AssetManager.service', entitySet, readLink);
        }
    }

    /**
     * Formats the file size is a more readable way
     * @param {string} rawFileSize the size from the document object as a string
     * @return {Promise} a promise of true if media is local.
     *
     * @memberof DocumentEventLibrary
     */
    static formatFileSize(rawFileSize) {
        if (rawFileSize) {
            const intValue = parseInt(rawFileSize);
            if (intValue > (1024 * 1024 * 1024)) {
                return Math.round(intValue / (1024 * 1024 * 10.24)) / 100 + ' GB';
            } else if (intValue > (1024 * 1024)) {
                return Math.round(intValue / (1024 * 10.24)) / 100 + ' MB';
            } else if (intValue > 1024) {
                return Math.round(intValue / 10.24) / 100 + ' KB';
            } else if (intValue > 0) {
                return intValue + ' B';
            } else {
                if (intValue === 0) {
                    return '-';
                }
                return intValue;
            }
        }
        return '-';
    }

    /**
     * Helper function to get the count of the documents
     * @param {*} clientAPI
     * @param {string} documentCollectionName the name of the collection of document links
     * @return {Promise} a promise with the count number
     *
     * @memberof DocumentEventLibrary
     */
    static getDocumentCount(clientAPI, entitySet, queryOptions, onlineService = false) {
        /**Implementing our Logger class*/
        Logger.debug(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'entitySet: ' + entitySet + 'queryOption: ' + queryOptions);
        const service = onlineService ? '/SAPAssetManager/Services/OnlineAssetManager.service' : undefined;
        return ComLib.getEntitySetCount(clientAPI, entitySet, queryOptions, service);
    }
    /**
     * Helper function to remap the linked documents into an array
     * @param {*} clientAPI
     * @param {string} documentCollectionName the name of the collection of document links
     * @param {string} documentPropertyName the property that contains the linked document
     * @return {Promise} a promise with an array of documents
     *
     * @memberof DocumentEventLibrary
     */
    static getRemappedDocuments(clientAPI, documentCollectionName, documentPropertyName) {
        let odataId = ComLib.getTargetPathValue(clientAPI.getPageProxy(), '#Property:@odata.id');
        return clientAPI.read('/SAPAssetManager/Services/AssetManager.service',
            odataId + '/' + documentCollectionName,
            [],
            '$expand=' + documentPropertyName).then((resultSet) => {
                let documents = [];
                resultSet.map((value) => {
                    const document = value[documentPropertyName];
                    if (document) {
                        documents.push(document);
                    }
                    return document;
                });

                return documents;
            });
    }

    /**
     * helper function to get the parent object type
     * @param {*} clientAPI
     * @param {string?} dataType an optional data type to use direct instead of from binding
     * @return {string} the type of the parent object as found in ParentObjectType. Returns the raw @odata.type if
     *                  the type is not found in ParentObjectType.
     *
     * @memberof DocumentEventLibrary
     */
    static getParentObjectType(clientAPI, dataType) {
        const odataType = dataType || clientAPI.binding['@odata.type'];
        return DocLib.lookupParentObjectType(clientAPI, odataType);
    }

    static lookupParentObjectType(clientAPI, odataType) {
        const workorderType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeWorkOrder.global').getValue();
        const notificationType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeNotification.global').getValue();
        const equipmentType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeEquipment.global').getValue();
        const onlineEquipmentType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeOnlineEquipment.global').getValue();
        const functionallocationType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeFunctionalLocation.global').getValue();
        const operation = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeOperation.global').getValue();
        const suboperation = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeSubOperation.global').getValue();
        const confirmation = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeConfirmation.global').getValue();
        const confirmationRow = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeConfirmationRow.global').getValue();
        const safetyCertificates = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentSafetyCertificatesODataType.global').getValue();
        const wcmApprovalType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeWCMApproval.global').getValue();
        const serviceItemType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeServiceItem.global').getValue();
        const wcmApplicationType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeWCMApplication.global').getValue();
        const wcmDocumentItem = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeWCMDocumentItem.global').getValue();
        const checklistType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeChecklist.global').getValue();
        const materialDocument = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeMaterialDocument.global').getValue();
        const OnlineFunctionalLocationType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/OnlineFunctionalLocation.global').getValue();

        let value = odataType;

        switch (odataType) {
            case workorderType:
                value = DocLib.ParentObjectType.WorkOrder;
                break;
            case materialDocument:
                value = DocLib.ParentObjectType.MaterialDocument;
                break;
            case notificationType:
                value = DocLib.ParentObjectType.Notification;
                break;
            case equipmentType:
                value = DocLib.ParentObjectType.Equipment;
                break;
            case onlineEquipmentType:
                value = DocLib.ParentObjectType.OnlineEquipment;
                break;
            case functionallocationType:
                value = DocLib.ParentObjectType.FunctionalLocation;
                break;
            case OnlineFunctionalLocationType:
                value = DocLib.ParentObjectType.OnlineFunctionalLocation;
                break;
            case operation:
                try {
                    if (clientAPI.evaluateTargetPathForAPI('#Page:CreateUpdatePage')) {
                        value = DocLib.ParentObjectType.InspectionLot;
                        break;
                    }
                } catch (error) {
                    Logger.debug(error);
                }
                value = DocLib.ParentObjectType.Operation;
                break;
            case suboperation:
                value = DocLib.ParentObjectType.SubOperation;
                break;
            case safetyCertificates:
                value = DocLib.ParentObjectType.WCMDocumentHeader;
                break;
            case wcmDocumentItem:
                value = DocLib.ParentObjectType.WCMDocumentItem;
                break;
            case confirmation:
            case confirmationRow:
                if (ComLib.getStateVariable(clientAPI, 'FinalConfirmationIsCompletingWorkOrder')) {
                    value = DocLib.ParentObjectType.WorkOrder;
                } else {
                    value = DocLib.ParentObjectType.Operation;
                }
                break;
            case wcmApprovalType:
                value = DocLib.ParentObjectType.WCMApproval;
                break;
            case serviceItemType:
                value = DocLib.ParentObjectType.S4ServiceItem;
                break;
            case wcmApplicationType:
                value = DocLib.ParentObjectType.WCMApplication;
                break;
            case '#sap_mobile.InspectionPoint':
            case '#sap_mobile.InspectionLot':
            case '#sap_mobile.InspectionCharacteristic':
            case checklistType:
                value = DocLib.ParentObjectType.InspectionLot;
                break;
            case '#sap_mobile.S4ServiceItem':
                value = DocLib.ParentObjectType.S4ServiceItem;
                break;
            case '#sap_mobile.S4ServiceOrder':
                value = DocLib.ParentObjectType.S4ServiceOrder;
                break;
            case '#sap_mobile.S4ServiceRequest':
                value = DocLib.ParentObjectType.S4ServiceRequest;
                break;
            case '#sap_mobile.S4ServiceConfirmation':
                value = DocLib.ParentObjectType.S4ServiceConfirmation;
                break;
            case '#sap_mobile.S4ServiceConfirmationItem':
                value = DocLib.ParentObjectType.S4ServiceConfirmationItem;
                break;
            case '#sap_mobile.MaterialDocItem':
                value = DocLib.ParentObjectType.MaterialDocItem;
                break;
            case '#sap_mobile.S4ServiceQuotation':
                value = DocLib.ParentObjectType.S4ServiceQuotation;
                break;
            case '#sap_mobile.NotificationHeader':
                value = DocLib.ParentObjectType.OnlineNotification;
                break;
            case '#sap_mobile.S4ServiceQuotationItem':
                value = DocLib.ParentObjectType.S4ServiceQuotationItem;
                break;
            default:
                // its something else, just return the value
                break;
        }

        return value;
    }

    /**
     * validation rule of Document Create action
     *
     * @static
     * @param {IPageProxy} pageProxy
     * @return {Promise} boolean, true if validation passes
     *
     * @memberof DocumentEventLibrary
     */
    static createValidationRule(pageProxy) {
        let valPromises = [];
        let container = pageProxy.getControl('FormCellContainer');
        let descriptionCtrl = container.getControl('AttachmentDescription');
        let charLimitInt = pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentDescriptionMaximumLength.global').getValue();
        let attachmentCtrl = container.getControl('Attachment');

        // get all of the validation promises
        if (descriptionCtrl) {
            //Clear previous inline errors if any
            descriptionCtrl.clearValidation();
            valPromises.push(DocLib.validationCharLimit(pageProxy, descriptionCtrl, charLimitInt));
            valPromises.push(DocLib.validationMinimumCount(pageProxy, attachmentCtrl, descriptionCtrl, 1));
        } else {
            valPromises.push(DocLib.validationMinimumCount(pageProxy, attachmentCtrl, attachmentCtrl, 1));
        }
        // check all validation promises;
        // if all resolved -> return true
        // if at least 1 rejected -> return false
        return Promise.all(valPromises).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }

    /**
     * validation rule that return wether it passes the character limit (inclusive)
     *
     * @static
     * @param {IPageProxy} context
     * @param {IControl} control
     * @param {number} maximumLength
     * @return {Promise}
     *
     * @memberof DocumentEventLibrary
     */
    static validationCharLimit(context, control, maximumLength) {
        let descriptionValue = control.getValue();
        let controlHasDefinedValue = ComLib.isDefined(descriptionValue);
        let attachments = context.getControl('FormCellContainer').getControl('Attachment').getValue() || [];

        if (attachments.length && !controlHasDefinedValue) {
            let message = context.localizeText('validation_document_description_should_not_be_empty');
            ComLib.executeInlineControlError(context, control, message);
            return Promise.reject(false);
        }

        if (controlHasDefinedValue && descriptionValue.length >= maximumLength) {
            let dynamicParams = [maximumLength.toString()];
            let message = context.localizeText('validation_maximum_field_length', dynamicParams);
            ComLib.executeInlineControlError(context, control, message);
            return Promise.reject(false);
        } else {
            return Promise.resolve(true);
        }
    }

    /**
    * validation rule that return wether it passes the size minimum limit (inclusive)
    *
    * @static
    * @param {IPageProxy} context
    * @param {IControl} control the control with the value to check
    * @param {IControl} errorControl the control to show errors on. Workaround for missing error field on the attachment control
    * @param {number} minimumLength
    * @return {Promise}
    *
    * @memberof DocumentEventLibrary
    */
    static validationMinimumCount(context, control, errorControl, minimumLength) {
        let attachmentCount = control.getValue().length;
        if (attachmentCount >= minimumLength) {
            return Promise.resolve(true);
        } else {
            let dynamicParams = minimumLength.toString();
            let message = context.localizeText('validation_minimum_number_of_attachments', dynamicParams);

            ComLib.executeInlineControlError(context, errorControl, message);

            return Promise.reject(false);
        }
    }

    /**
     * returns the count of attachments on the current page's FormCellContainer -> Attachment control. Zero if there is an error
     * useful for checking the count from other object add pages
     *
     * @static
     * @param {IPageProxy} pageProxy
     * @param {String} pageName
     * @return {number} the number of attachments
     *
     * @memberof DocumentEventLibrary
     */
    static validationAttachmentCount(pageProxy, pageName) {
        let value = 0;
        try {
            if (pageName) {
                const controlValue = ComLib.getTargetPathValue(pageProxy, '#Page:' + pageName + '/#Control:Attachment/#Value');
                value = controlValue.length;
            } else {
                const control = pageProxy.getControl('FormCellContainer').getControl('Attachment');
                value = control.getValue().length;
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'Error getting attachment count: ' + err);

        }
        value = value === undefined ? 0 : value;
        return value;
    }

    /**
    * checks to see if an attachment description has been added or if a file has been attached during the creation of
    * a workorder or a notification
    *
    * @static
    * @param {IPageProxy} pageProxy
    * @return {boolean}
    *
    */
    static attachmentSectionHasData(pageProxy) {
        const descriptionCtrl = pageProxy.getControl('FormCellContainer').getControl('AttachmentDescription');
        return !!(descriptionCtrl && (descriptionCtrl.getValue() || DocLib.validationAttachmentCount(pageProxy) > 0));
    }

    /**
     * retrieves the appropriate ClassName to be used when documents are created for
     * this object type
     *
     * @static
     * @param {ClientAPI} clientAPI
     * @return {string} the class name or empty string if not found
     *
     * @memberof DocumentEventLibrary
     */
    static getBDSClassName(clientAPI) {
        let value = ComLib.getAppParam(clientAPI, 'BDSDOCUMENT', DocLib.getParentObjectType(clientAPI));
        if (value) {
            return value;
        }
        return '';
    }

    /**
     * retrieves the appropriate ObjectLink to be used when documents are created for
     * this object type
     *
     * @static
     * @param {ClientAPI} clientAPI
     * @param {string?} dataType
     * @return {string} the object link or empty string if not found
     *
     * @memberof DocumentEventLibrary
     */
    static getObjectLink(clientAPI, dataType) {
        switch (DocLib.getParentObjectType(clientAPI, dataType)) {
            case DocLib.ParentObjectType.WorkOrder:
                return libWo.isServiceOrder(clientAPI).then(isServiceOrder => {
                    return ComLib.getAppParam(clientAPI, 'DOCUMENT', isServiceOrder ? DocLib.ParentObjectType.ServiceOrder : DocLib.ParentObjectType.WorkOrder);
                });
            case DocLib.ParentObjectType.Notification:
                return NotifLib.isServiceNotification(clientAPI).then(isServiceNotification => {
                    return ComLib.getAppParam(clientAPI, 'DOCUMENT', isServiceNotification ? DocLib.ParentObjectType.ServiceNotification : DocLib.ParentObjectType.Notification);
                });
            case DocLib.ParentObjectType.S4ServiceQuotationItem:
            case DocLib.ParentObjectType.S4ServiceItem:
            case DocLib.ParentObjectType.S4ServiceConfirmationItem:
                {
                    if (ComLib.isDefined(clientAPI.binding)) {
                        return clientAPI.binding.ItemObjectType;
                    }
                    return '';
                }
            case DocLib.ParentObjectType.S4ServiceQuotation:
            case DocLib.ParentObjectType.S4ServiceOrder:
                return S4ServiceLibrary.getServiceOrderObjectType(clientAPI);
            case DocLib.ParentObjectType.S4ServiceConfirmation:
                return S4ServiceLibrary.getServiceConfirmationObjectType(clientAPI);
            case DocLib.ParentObjectType.S4ServiceRequest:
                return S4ServiceLibrary.getServiceRequestObjectType(clientAPI);
            case DocLib.ParentObjectType.MaterialDocItem:
                return ComLib.getAppParam(clientAPI, 'DOCUMENT', DocLib.ParentObjectType.MaterialDocument);
            default:
                return ComLib.getAppParam(clientAPI, 'DOCUMENT', DocLib.getParentObjectType(clientAPI, dataType));
        }
    }

    /**
     * retrieves the classtype to be used when documents are created
     *
     * @static
     * @param {ClientAPI} clientAPI
     * @return {string} the class type or empty string if not found
     *
     * @memberof DocumentEventLibrary
     */
    static getBDSClassType(clientAPI) {
        let value = ComLib.getAppParam(clientAPI, 'BDSDOCUMENT', 'ClassType');
        if (value) {
            return value;
        }
        return '';
    }

    static get ParentObjectType() {
        return {
            WorkOrder: 'WorkOrder',
            ServiceOrder: 'ServiceOrder',
            Notification: 'Notification',
            ServiceNotification: 'ServiceNotification',
            Equipment: 'Equipment',
            OnlineEquipment: 'OnlineEquipment',
            FunctionalLocation: 'FunctionalLocation',
            OnlineFunctionalLocation: 'OnlineFunctionalLocation',
            Operation: 'WorkOrderOperation',
            SubOperation: 'SubOperation',
            WCMDocumentHeader: 'WCMDocumentHeader',
            WCMApproval: 'WCMApproval',
            WCMApplication: 'WCMApplication',
            WCMDocumentItem: 'WCMDocumentItem',
            InspectionLot: 'InspectionLot',
            S4ServiceOrder: 'S4ServiceOrder',
            S4ServiceRequest: 'S4ServiceRequest',
            S4ServiceItem: 'S4ServiceItem',
            S4ServiceConfirmation: 'S4ServiceConfirmation',
            S4ServiceConfirmationItem: 'S4ServiceConfirmationItem',
            MaterialDocument: 'MaterialDocument',
            MaterialDocItem: 'MaterialDocItem',
            S4ServiceQuotation: 'S4ServiceQuotation',
            OnlineNotification: 'OnlineNotification',
            S4ServiceQuotationItem: 'S4ServiceQuotationItem',
        };
    }
    /**
    * retrieves the Document Entity Set and query option based on the cell
    *
    * @static
    * @param {ClientAPI} controlProxy
    * @return {Dictionary} dictionary with key entity sey and query option
    *
    */
    static getDocumentObjectDetail(controlProxy) {
        let documentObjectDetail = [];
        let id = '';
        let year = '';
        let operation_num = '';

        if (!ValidationLibrary.evalIsEmpty(controlProxy.getPageProxy().binding)) {
            switch (DocLib.lookupParentObjectType(controlProxy, controlProxy.getPageProxy().binding['@odata.type'])) {
                case DocLib.ParentObjectType.WorkOrder:
                    id = controlProxy.getPageProxy().binding.OrderId;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=OrderId eq '" + id + "' and (OperationNo eq '' or OperationNo eq null) and " + this.getDocumentFilter(),
                        'entitySet': 'MyWorkOrderDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.MaterialDocItem:
                    id = controlProxy.binding.AssociatedMaterialDoc.MaterialDocNumber;
                    year = controlProxy.binding.AssociatedMaterialDoc.MaterialDocYear;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=MaterialDoc eq '" + id + "' and MatDocYear eq '" + year + "' and " + this.getDocumentFilter(),
                        'entitySet': 'MatDocAttachments',
                    });
                    break;
                case DocLib.ParentObjectType.Notification:
                    id = controlProxy.getPageProxy().binding.NotificationNumber;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=NotificationNumber eq '" + id + "' and " + this.getDocumentFilter(),
                        'entitySet': 'MyNotifDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.Equipment:
                    id = controlProxy.getPageProxy().binding.EquipId;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=EquipId eq '" + id + "' and " + this.getDocumentFilter(),
                        'entitySet': 'MyEquipDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.FunctionalLocation:
                    id = controlProxy.getPageProxy().binding.FuncLocIdIntern;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=FuncLocIdIntern eq '" + id + "' and " + this.getDocumentFilter(),
                        'entitySet': 'MyFuncLocDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.Operation:
                    id = controlProxy.getPageProxy().binding.OrderId;
                    operation_num = controlProxy.getPageProxy().binding.OperationNo;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=OrderId eq '" + id + "' and OperationNo eq '" + operation_num + "' and " + this.getDocumentFilter(),
                        'entitySet': 'MyWorkOrderDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.SubOperation:
                    id = controlProxy.getPageProxy().binding.SubOperationNo;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=SubOperationNo eq '" + id + "' and " + this.getDocumentFilter(),
                        'entitySet': 'MyWorkOrderDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.InspectionLot:
                    id = controlProxy.getPageProxy().binding.InspectionLot;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=InspectionLot eq '" + id + "' and " + this.getDocumentFilter(),
                        'entitySet': 'InspectionLotDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.S4ServiceItem:
                    id = controlProxy.getPageProxy().binding.ObjectID;
                    operation_num = controlProxy.getPageProxy().binding.ItemNo;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=ObjectID eq '" + id + "' and ItemNo eq '" + operation_num + "'",
                        'entitySet': 'S4ServiceOrderDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.S4ServiceOrder:
                    id = controlProxy.getPageProxy().binding.ObjectID;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=HeaderID eq '" + id + "' and " + this.getDocumentFilter(),
                        'entitySet': 'S4ServiceOrderDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.S4ServiceConfirmation:
                    id = controlProxy.getPageProxy().binding.ObjectID;
                    documentObjectDetail.push({
                        'queryOption': "$filter=ObjectID eq '" + id + "'",
                        'entitySet': 'S4ServiceConfirmationDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.S4ServiceConfirmationItem:
                    id = controlProxy.getPageProxy().binding.ObjectID;
                    documentObjectDetail.push({
                        'queryOption': "$filter=ObjectID eq '" + id + "' and ItemNo eq '" + controlProxy.getPageProxy().binding.ItemNo + "'",
                        'entitySet': 'S4ServiceConfirmationDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.S4ServiceRequest:
                    id = controlProxy.getPageProxy().binding.ObjectID;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=HeaderID eq '" + id + "' and " + this.getDocumentFilter(),
                        'entitySet': 'S4ServiceRequestDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.S4ServiceQuotation:
                    id = controlProxy.getPageProxy().binding.ObjectID;
                    documentObjectDetail.push({
                        'queryOption': "$filter=HeaderID eq '" + id + "' and " + this.getDocumentFilter(),
                        'entitySet': 'S4ServiceQuotationDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.S4ServiceQuotationItem:
                    id = controlProxy.getPageProxy().binding.ObjectID;
                    documentObjectDetail.push({
                        'queryOption': "$filter=ObjectID eq '" + id + "' and ItemNo eq '" + controlProxy.getPageProxy().binding.ItemNo + "'",
                        'entitySet': 'S4ServiceQuotationDocuments',
                    });
                    break;
                default:
                    break;
            }
        }
        return documentObjectDetail;
    }

    /**
     * For a given document, this returns the base64String
     *
     * @static
     * @param {ClientAPI} context
     * @param {documentObject} Document
     * @return {String}
     *
     */
    static getBase64String(context, documentObject) {
        let base64String = '';
        let documentPath = DocumentPath(context, documentObject);
        let documentFile = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.File.fromPath(documentPath);

        let binarySource = documentFile.readSync(error => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'Error getting binary source: ' + error);
        });

        if (binarySource) {
            base64String = Base64Library.transformBinaryToBase64(IsAndroid(context), binarySource);
        }

        return base64String;
    }

    /**
     * read all the attachments
     *
     * @static
     * @param {context} context
     * @param {objectDetails} object details like entity set and the query options
     * @return {array} array of attachments
     *
     */
    static readAttachments(context, objectDetails) {
        if (ComLib.IsOnCreate(context)) {
            return Promise.resolve([]);
        }
        let serviceName = '/SAPAssetManager/Services/AssetManager.service';
        let promises = [];
        let attachmentData = [];
        if (objectDetails.length) {
            return context.read(serviceName, objectDetails[0].entitySet, [], objectDetails[0].queryOption).then(attachments => {
                attachments.forEach(attachmentObject => {
                    let documentObject = attachmentObject.Document;
                    if (documentObject) {
                        let readLink = documentObject['@odata.readLink'];
                        let entitySet = readLink.split('(')[0];
                        promises.push(context.isMediaLocal(serviceName, entitySet, readLink).then((isMediaLocal) => {
                            return [isMediaLocal, documentObject];
                        }));
                    }
                });

                return Promise.all(promises).then(results => {
                    results.forEach((result) => {
                        const isMedialLocal = result[0];
                        const attachment = result[1];
                        if (isMedialLocal && !attachment.FileSize) {
                            const entitySet = 'Documents';
                            const property = 'Document';
                            const readLink = attachment['@odata.readLink'];
                            const service = '/SAPAssetManager/Services/AssetManager.service';
                            const documentPath = DocumentPath(context, attachment);
                            let attachmentEntry = context.createAttachmentEntry(documentPath, entitySet, property, readLink, service);
                            this.setAttachmentData(attachmentEntry, attachmentData);
                        }
                    });

                    return attachmentData;
                });
            });
        } else {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'Cannot find parent object type');
        }
        return Promise.resolve([]);
    }

    static setAttachmentData(attachmentEntry, attachmentData) {
        if (attachmentEntry) {
            attachmentData.push(attachmentEntry);
        }
    }

    static getDocumentFilter() {
        return "sap.entityexists(Document) and (Document/FileName ne '' or Document/FileName ne null)";
    }

    static getDocumentFromBinding(binding) {
        const doc = binding.Document || binding.PRTDocument;
        return ValidationLibrary.evalIsEmpty(doc) ? binding : doc;
    }

    /**
     * Get page proxy, page client data, selected documents mapping, documents list and selectable section for download documents functionality
     * Moved to a separate method to reduce repetitive code
     *
     * @param {ClientAPI} context MDK context of control
     * @returns {object}
     */
    static getDownloadDocumentsDataFromContext(context) {
        const pageProxy = context.getPageProxy();
        const selectableSections = ValidationLibrary.evalIsEmpty(pageProxy.getControls()[0]) ? [] : pageProxy.getControls()[0].getSections().filter(section => section.getName().includes('DocumentsSection'));
        const pageProxyClientData = pageProxy.getClientData();
        const selectedDocuments = pageProxyClientData.selectedDocuments || [];
        const documentsList = context.binding ? context.binding.documentsList || [] : [];
        const totalSection = ValidationLibrary.evalIsEmpty(pageProxy.getControls()[0]) ? undefined : pageProxy.getControls()[0].getSection('TotalSection');

        return {
            pageProxy,
            pageProxyClientData,
            selectedDocuments,
            documentsList,
            selectableSections,
            totalSection,
        };
    }

    /**
     * Get expand query options for nav rule
     *
     * @param {ClientAPI} context MDK context
     * @param {string} dataType object data type
     * @returns {string} query options
     */
    static getExpandQueryForDownloadDocumentsNav(context, dataType) {
        let expand;
        switch (dataType) {
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue()):
                expand = 'WCMDocumentItems,WCMDocumentItems/MyEquipments,WCMDocumentItems/MyFunctionalLocations';
                break;
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentItem.global').getValue()):
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApproval.global').getValue()):
                expand = 'MyEquipments,MyFunctionalLocations';
                break;
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue()):
                expand = 'RefObjects_Nav,RefObjects_Nav/Equipment_Nav,RefObjects_Nav/FuncLoc_Nav';
                break;
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue()):
                expand = 'Operations';
                break;
            default:
                expand = '';
        }

        return expand && `$expand=${expand}`;
    }

    /**
     * Get mapping object with filterable documents nav links and nested objects to build filter query options for download documents list.
     * Based on this mapping, filter criterias are recursive collected to filter the list of documents.
     * On each level we can specify list of filterEntitySets and list of nestedObjects.
     *
     * In filterEntitySets need to specify names of navigation links and filterProperties which will be used to filter Documents entity set.
     * filterProperties is object where key is property for filter and value is property by which value for filter will be taken.
     * If there is more than one key in filterProperties object, then they will be combined with AND operator.
     * Example get documents for Operation:
     *          {
     *              docEntitySetNav: 'WODocuments',
     *                  filterProperties: {
     *                      OrderId: 'OrderId',
     *                      OperationNo: 'OperationNo',
     *                  },
     *          } => result filter string ((WODocuments/any(doc: (doc/OrderId eq OperationData['OrderId'] and doc/OperationNo eq OperationData['OperationNo']))))
     *
     * List of nestedObjects is needed if documents should be downloaded for nested objects too or filter criteria cannot be collected from header data.
     * nestedObjectNav is name of nav link where nested object or list of nested objects can be taken.
     * Example: need to get documents for Operational Item and linked tech object (FLOC). FuncLocIdIntern it is not a property of WCMDocumentItems entity set but we can get this value from MyFunctionalLocations nav link.
     *
     *
     * @param {ClientAPI} context MDK context
     * @param {string} dataType object data type
     * @returns {object|undefined} mapping object with filterable documents nav links and nested objects or undefined if mapping not specified for data type
     */
    static getFilterEntitySetsMappingForDownloadDocuments(context, dataType) {
        switch (dataType) {
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue()):
                return {
                    mainEntitySet: {
                        docEntitySetNav: 'WCMDocumentHeaderAttachments',
                        filterProperties: {
                            WCMDocument: 'WCMDocument',
                        },
                    },
                    nestedObjects: [
                        {
                            nestedObjectNav: 'WCMDocumentItems',
                            filterEntitySets: [
                                {
                                    docEntitySetNav: 'WCMDocumentItemAttachments',
                                    filterProperties: {
                                        WCMDocument: 'WCMDocument',
                                        WCMDocumentItem: 'WCMDocumentItem',
                                    },
                                },
                            ],
                        },
                    ],
                    filterEntitySets: [
                        {
                            docEntitySetNav: 'FuncLocDocuments',
                            filterProperties: {
                                FuncLocIdIntern: 'FuncLocIdIntern',
                            },
                        },
                        {
                            docEntitySetNav: 'EquipDocuments',
                            filterProperties: {
                                EquipId: 'EquipId',
                            },
                        },
                    ],
                };
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentItem.global').getValue()):
                return {
                    mainEntitySet: {
                        docEntitySetNav: 'WCMDocumentItemAttachments',
                        filterProperties: {
                            WCMDocument: 'WCMDocument',
                            WCMDocumentItem: 'WCMDocumentItem',
                        },
                    },
                    nestedObjects: [
                        {
                            nestedObjectNav: 'MyFunctionalLocations',
                            filterEntitySets: [
                                {
                                    docEntitySetNav: 'FuncLocDocuments',
                                    filterProperties: {
                                        FuncLocIdIntern: 'FuncLocIdIntern',
                                    },
                                },
                            ],
                        },
                        {
                            nestedObjectNav: 'MyEquipments',
                            filterEntitySets: [
                                {
                                    docEntitySetNav: 'EquipDocuments',
                                    filterProperties: {
                                        EquipId: 'EquipId',
                                    },
                                },
                            ],
                        },
                    ],
                };
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue()):
                return {
                    mainEntitySet: {
                        docEntitySetNav: 'WCMApplicationAttachments',
                        filterProperties: {
                            WCMApplication: 'WCMApplication',
                        },
                    },
                    filterEntitySets: [
                        {
                            docEntitySetNav: 'FuncLocDocuments',
                            filterProperties: {
                                FuncLocIdIntern: 'FuncLocIdIntern',
                            },
                        },
                        {
                            docEntitySetNav: 'EquipDocuments',
                            filterProperties: {
                                EquipId: 'EquipId',
                            },
                        },
                    ],
                };
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApproval.global').getValue()):
                return {
                    mainEntitySet: {
                        docEntitySetNav: 'WCMApprovalAttachments',
                        filterProperties: {
                            WCMApproval: 'WCMApproval',
                        },
                    },
                    nestedObjects: [
                        {
                            nestedObjectNav: 'MyFunctionalLocations',
                            filterEntitySets: [
                                {
                                    docEntitySetNav: 'FuncLocDocuments',
                                    filterProperties: {
                                        FuncLocIdIntern: 'FuncLocIdIntern',
                                    },
                                },
                            ],
                        },
                        {
                            nestedObjectNav: 'MyEquipments',
                            filterEntitySets: [
                                {
                                    docEntitySetNav: 'EquipDocuments',
                                    filterProperties: {
                                        EquipId: 'EquipId',
                                    },
                                },
                            ],
                        },
                    ],
                };
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue()):
                return {
                    mainEntitySet: {
                        docEntitySetNav: 'WODocuments',
                        filterProperties: {
                            OrderId: 'OrderId',
                        },
                        excludeProperties: ['OperationNo'],
                    },
                    filterEntitySets: [
                        {
                            docEntitySetNav: 'FuncLocDocuments',
                            filterProperties: {
                                FuncLocIdIntern: 'HeaderFunctionLocation',
                            },
                        },
                        {
                            docEntitySetNav: 'EquipDocuments',
                            filterProperties: {
                                EquipId: 'HeaderEquipment',
                            },
                        },
                    ],
                    nestedObjects: [
                        {
                            nestedObjectNav: 'Operations',
                            filterEntitySets: [
                                {
                                    docEntitySetNav: 'WODocuments',
                                    filterProperties: {
                                        OrderId: 'OrderId',
                                        OperationNo: 'OperationNo',
                                    },
                                },
                            ],
                        },
                    ],
                };
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue()):
                return {
                    mainEntitySet: {
                        docEntitySetNav: 'WODocuments',
                        filterProperties: {
                            OrderId: 'OrderId',
                            OperationNo: 'OperationNo',
                        },
                    },
                    filterEntitySets: [
                        {
                            docEntitySetNav: 'FuncLocDocuments',
                            filterProperties: {
                                FuncLocIdIntern: 'OperationFunctionLocation',
                            },
                        },
                        {
                            docEntitySetNav: 'EquipDocuments',
                            filterProperties: {
                                EquipId: 'OperationEquipment',
                            },
                        },
                    ],
                };
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Notification.global').getValue()):
                return {
                    mainEntitySet: {
                        docEntitySetNav: 'NotifDocuments',
                        filterProperties: {
                            NotificationNumber: 'NotificationNumber',
                        },
                    },
                    filterEntitySets: [
                        {
                            docEntitySetNav: 'FuncLocDocuments',
                            filterProperties: {
                                FuncLocIdIntern: 'HeaderFunctionLocation',
                            },
                        },
                        {
                            docEntitySetNav: 'EquipDocuments',
                            filterProperties: {
                                EquipId: 'HeaderEquipment',
                            },
                        },
                    ],
                };
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue()):
                return {
                    mainEntitySet: {
                        docEntitySetNav: 'EquipDocuments',
                        filterProperties: {
                            EquipId: 'EquipId',
                        },
                    },
                };
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue()):
                return {
                    mainEntitySet: {
                        docEntitySetNav: 'FuncLocDocuments',
                        filterProperties: {
                            FuncLocIdIntern: 'FuncLocIdIntern',
                        },
                    },
                };
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceRequest.global').getValue()):
                return {
                    mainEntitySet: {
                        docEntitySetNav: 'S4ServiceRequestDocument_Nav',
                        filterProperties: {
                            ObjectID: 'ObjectID',
                            ObjectType: 'ObjectType',
                        },
                    },
                };
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeServiceItem.global').getValue()):
                return {
                    mainEntitySet: {
                        docEntitySetNav: 'S4ServiceOrderDocs_Nav',
                        filterProperties: {
                            ObjectID: 'ObjectID',
                            ItemNo: 'ItemNo',
                        },
                    },
                };
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceConfirmation.global').getValue()):
                return {
                    mainEntitySet: {
                        docEntitySetNav: 'S4ServiceConfirmationDocument_Nav',
                        filterProperties: {
                            ObjectID: 'ObjectID',
                            ObjectType: 'ObjectType',
                        },
                    },
                };
            case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue()):
                return {
                    mainEntitySet: {
                        docEntitySetNav: 'S4ServiceOrderDocs_Nav',
                        filterProperties: {
                            ObjectID: 'ObjectID',
                            ObjectType: 'ObjectType',
                        },
                    },
                    nestedObjects: [
                        {
                            nestedObjectNav: 'RefObjects_Nav',
                            nestedObjects: [
                                {
                                    nestedObjectNav: 'FuncLoc_Nav',
                                    filterEntitySets: [
                                        {
                                            docEntitySetNav: 'FuncLocDocuments',
                                            filterProperties: {
                                                FuncLocIdIntern: 'FuncLocIdIntern',
                                            },
                                        },
                                    ],
                                },
                                {
                                    nestedObjectNav: 'Equipment_Nav',
                                    filterEntitySets: [
                                        {
                                            docEntitySetNav: 'EquipDocuments',
                                            filterProperties: {
                                                EquipId: 'EquipId',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                };
            default:
                return undefined;
        }
    }

    /**
     * Collect filters for download documents functionality
     * @param {object} item data from which can be taken values for filters
     * @param {*} mapping mapping of nestedObjects and filterEntitySets
     * @param {*} filters object where collected entity sets and values for filters. Key - name of entity set, value - list of filter values
     */
    static collectFiltersForDownloadDocuments(item, mapping, filters) {
        const self = this;

        if (!ValidationLibrary.evalIsEmpty(mapping.mainEntitySet)) {
            let filterProperties = mapping.mainEntitySet.filterProperties;
            let docEntitySetNav = mapping.mainEntitySet.docEntitySetNav;
            let excludeProperties = mapping.mainEntitySet.excludeProperties;

            // Loop through filterProperties to create an array of queries
            // filterProperties contains the filtering property name and the binding property name
            const filterCriteria = Object.entries(filterProperties).reduce((acc, current) => {
                return self.getFilterCriteria(item, current, excludeProperties, acc);
            }, []);

            if (!ValidationLibrary.evalIsEmpty(filterCriteria)) {
                const filterCriteriaStr = `(${filterCriteria.join(' and ')})`;
                filters.push({
                    'entitySet': docEntitySetNav,
                    'filter': filterCriteriaStr,
                    'isMain': true,
                });
            }
        }

        if (!ValidationLibrary.evalIsEmpty(mapping.filterEntitySets)) {
            // Loop through filterEntitySets to create an array of queries
            // filterProperties contains the filtering property name and the binding property name
            mapping.filterEntitySets.forEach(({ docEntitySetNav, filterProperties }) => {
                const filterCriteria = Object.entries(filterProperties).reduce((acc, current) => {
                    return self.getFilterEntitySets(item, current, acc);
                }, []);

                if (!ValidationLibrary.evalIsEmpty(filterCriteria)) {
                    const filterCriteriaStr = `(${filterCriteria.join(' and ')})`;
                    filters.push({
                        'entitySet': docEntitySetNav,
                        'filter': filterCriteriaStr,
                        'isMain': false,
                    });
                }
            });
        }

        if (!ValidationLibrary.evalIsEmpty(mapping.nestedObjects)) {
            mapping.nestedObjects.forEach(nestedMapping => {
                const nestedObjValue = item[nestedMapping.nestedObjectNav];
                if (nestedObjValue) {
                    if (Array.isArray(nestedObjValue) && !ValidationLibrary.evalIsEmpty(nestedObjValue)) {
                        nestedObjValue.forEach(nestedItem => {
                            self.collectFiltersForDownloadDocuments(nestedItem, nestedMapping, filters);
                        });
                    } else {
                        self.collectFiltersForDownloadDocuments(nestedObjValue, nestedMapping, filters);
                    }
                }
            });
        }
    }

    static getFilterCriteria(item, current, excludeProperties, accomulator) {
        const acc = accomulator;
        const value = item[current[1]];
        if (!ValidationLibrary.evalIsEmpty(value)) {
            if (excludeProperties) {
                let excludeString = excludeProperties.map(property => `doc/${property} eq ''`);
                acc.push(`doc/${current[0]} eq '${item[current[1]]}' and ${excludeString.join(' and ')}`);
            } else {
                acc.push(`doc/${current[0]} eq '${item[current[1]]}'`);
            }
        }
        return acc;
    }

    static getFilterEntitySets(item, current, accomulator) {
        const acc = accomulator;
        const value = item[current[1]];
        if (!ValidationLibrary.evalIsEmpty(value)) {
            acc.push(`doc/${current[0]} eq '${item[current[1]]}'`);
        }
        return acc;
    }

    /**
     * Get list of documents avaialble for download
     * @param {ClientAPI} context MDK context
     * @param {object} item binding data
     * @returns {Promise<[{documents: Document[], status: string}]>} list of documents avaialable to download
     */
    static async getDocumentsListForDownload(context, item) {
        let documentsToDownloadStatus = '';

        const filterEntitySetsMapping = this.getFilterEntitySetsMappingForDownloadDocuments(context, item['@odata.type']);

        if (ValidationLibrary.evalIsEmpty(filterEntitySetsMapping)) {
            return Promise.resolve([{ documents: [], status: documentsToDownloadStatus }]);
        }

        const filters = [];
        this.collectFiltersForDownloadDocuments(item, filterEntitySetsMapping, filters);

        if (ValidationLibrary.evalIsEmpty(filters)) {
            return Promise.resolve([{ documents: [], status: documentsToDownloadStatus }]);
        }

        let documents = [];
        let readDocPromises = [];
        filters.forEach(filter => {
            let doc = {
                'parentEntitySet': filter.entitySet,
                'isMainObject': filter.isMain,
            };

            if (!doc.isMainObject) {
                let splitedString = filter.filter.split('\'');

                if (splitedString.length > 2) {
                    doc.ids = [splitedString[1], splitedString[splitedString.length - 2]];
                } else {
                    doc.ids = [splitedString[splitedString.length - 2]];
                }
            }

            documents.push(doc);

            const queryOptions = `$orderby=FileName&$filter=ObjectType ne 'URL' and FileName ne '' and FileName ne null and ${filter.entitySet}/any(doc: ${filter.filter})`;
            readDocPromises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'Documents', [], queryOptions));
        });

        return Promise.all(readDocPromises).then(results => {
            results.forEach((result, index) => {
                let documentsListToDownload = result.filter(doc => !doc['@sap.mediaIsOffline']);

                if (result.length === 0) {
                    documentsToDownloadStatus = 'no_documents';
                } else if (documentsListToDownload.length === 0) {
                    documentsToDownloadStatus = 'all_downloaded';
                } else {
                    documentsToDownloadStatus = '';
                }

                documents[index].documents = documentsListToDownload;
                documents[index].status = documentsToDownloadStatus;
            });

            return documents;
        });
    }


    /**
     * Check if there are no documents to download or if all files have been downloaded
     * @param {ClientAPI} context MDK context
     * @returns {Boolean} return true if there are any documents to download, otherwise return false
     */
    static checkIfNoDocumentsAvailableForDownload(context) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}`, [], this.getExpandQueryForDownloadDocumentsNav(context, context.binding['@odata.type']))
            .then(parentItemResult => {
                const item = parentItemResult.getItem(0);
                return this.getDocumentsListForDownload(context, item).then(results => {
                    let statuses = results.map(result => result.status);
                    return results.every(result => result.documents.length === 0) || statuses.every(status => status === 'all_downloaded');
                });
            });
    }
}
