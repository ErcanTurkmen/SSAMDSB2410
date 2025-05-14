import { PartnerFunction } from '../Common/Library/PartnerFunction';
import common from '../Common/Library/CommonLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';
import libVal from '../Common/Library/ValidationLibrary';
import DocumentLibrary from '../Documents/DocumentLibrary';
import Logger from '../Log/Logger';
import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';

export default function PDFGenerate(context, completionBinding) {
    let binding = completionBinding || context.binding;

    if (common.getStateVariable(context, 'contextMenuSwipePage')) { //coming in via the context menu
        binding = common.GetBindingObject(context);
    }


    common.setStateVariable(context, 'CompletionBinding', completionBinding);

    if (binding['@odata.type'] === '#sap_mobile.S4ServiceOrder' || binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        return prepareS4OrderInfo(context, binding).then(info => {
            return setUpBindingAndOpenPDF(context, binding, info);
        });
    }

    return prepareOrderInfo(context, binding).then(info => {
        return setUpBindingAndOpenPDF(context, binding, info);
    });
}

function setUpBindingAndOpenPDF(context, binding, documentData) {
    binding.Order = documentData;
    if (context.getPageProxy() && context.getPageProxy().setActionBinding) {
        context.getPageProxy().setActionBinding(binding);
    }
    common.setStateVariable(context, 'ServiceReportData', binding);
    return context.executeAction('/SAPAssetManager/Actions/PDF/PDFControlPageNav.action');
}

function prepareOrderInfo(context, binding) {
    let serviceName = '/SAPAssetManager/Services/AssetManager.service';
    let orderId = binding.OrderId || binding.OrderID;

    return context.read(serviceName, 'MyWorkOrderHeaders', [], `$filter=OrderId eq '${orderId}'&$expand=Equipment,FunctionalLocation,Operations,WOSales_Nav,Operations/EquipmentOperation,Operations/FunctionalLocationOperation,WOObjectList_Nav/Equipment_Nav,WOObjectList_Nav/FuncLoc_Nav,Operations/WOObjectList_Nav/Equipment_Nav,Operations/WOObjectList_Nav/FuncLoc_Nav,OrderMobileStatus_Nav,WOSales_Nav/Customer_Nav,HeaderLongText,Operations/OperationMobileStatus_Nav`).then(orderResult => {
        if (orderResult.length > 0) {
            let order = orderResult.getItem(0);
            let promises = [];
            let userId = common.getSapUserName(context);

            //Get the technician name
            let sapUserPromise = context.read(serviceName, 'SAPUsers', ['UserName'], `$filter=UserId eq '${userId}'`);
            promises.push(sapUserPromise);

            //Get the sold to party address
            let addressPromise = context.read(serviceName, `${order['@odata.readLink']}/WOPartners`, [], `$filter=PartnerFunction eq '${PartnerFunction.getSoldToPartyPartnerFunction()}'&$expand=Address_Nav`);
            promises.push(addressPromise);

            //Get all attachments
            let attachmentsPromise = context.read(serviceName, 'MyWorkOrderDocuments', [], `$filter=OrderId eq '${order.OrderId}'&$expand=Document`);
            promises.push(attachmentsPromise);

            //Get all materials
            let materialsPromise = context.read(serviceName, 'MyWorkOrderComponents', [], `$filter=OrderId eq '${order.OrderId}'`);
            promises.push(materialsPromise);

            return Promise.all(promises).then(([user, address, attachments, materials]) => {
                populateUserName(order, user);
                populateAddress(order, address);
                populateAttachmentsAndSignatures(context, order, attachments, binding);
                populateAssets(order);
                setupAdditionalProperties(context, order);
                populateMaterials(order, materials);
                
                return Promise.resolve(order);
            });
        } else {     
            Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'No data for pdf, WO id ' + orderId);
            return Promise.resolve(_getEmptyDocumentStructure());
        }
    })
    .catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'Error getting data for pdf: ' + error);
        return Promise.resolve(_getEmptyDocumentStructure());
    });
}

function setupAdditionalProperties(context, workOrder) {
    let formattedDate = '';
    
    if (workOrder.WOSales_Nav && workOrder.WOSales_Nav.ContractDateTo) {
        let odataDate = new OffsetODataDate(context, workOrder.WOSales_Nav.ContractDateTo);
        formattedDate = context.formatDate(odataDate.date());
        workOrder.WOSales_Nav.ContractDateTo = formattedDate;
    }
    if (libVal.evalIsEmpty(workOrder.OrderDescription)) {
        workOrder.OrderDescription = '-';
    }
}

function populateAttachmentsAndSignatures(context, documentData, attachmenets, binding = {}) {
    let attachments = [];
    documentData.TechnicianSignature = '';
    documentData.CustomerSignature = '';

    let customerSignaturePrefix = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentCustomerSignaturePrefix.global').getValue();
    let technicianSignaturePrefix = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentTechnicianSignaturePrefix.global').getValue();
    let workOrderOperationDataType = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeOperation.global').getValue();
    let serviceOrderItemDataType = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeServiceItem.global').getValue();

    if (attachmenets.length > 0) {
        for (let i=0; i < attachmenets.length; i++) {
            let attachment = attachmenets.getItem ? attachmenets.getItem(i) : attachmenets[i];
            let document = attachment.Document;

            if (document && Object.prototype.hasOwnProperty.call(document,'@sap.mediaIsOffline') && document['@sap.mediaIsOffline'] && document['@odata.mediaContentType'].includes('image')) { //Only grab the ones that are local/downloaded & show only images
                let base64String = DocumentLibrary.getBase64String(context, document);

                if (document.FileName.startsWith(technicianSignaturePrefix)) { //Technician Signature
                    //if we are at operation or item level then we need to grab the signature from operation/item level
                    if (binding['@odata.type'] === workOrderOperationDataType) {
                        if (attachment.OperationNo === binding.OperationNo) {
                            documentData.TechnicianSignature = base64String;
                        }
                    } else if (binding['@odata.type'] === serviceOrderItemDataType) {
                        if (attachment.ItemNo === binding.ItemNo) {
                            documentData.TechnicianSignature = base64String;
                        }
                    } else {
                        documentData.TechnicianSignature = base64String;
                    }
                } else if (document.FileName.startsWith(customerSignaturePrefix)) { //Customer Signature
                    //if we are at operation level then we need to grab the signature from operation level
                    if (binding['@odata.type'] === workOrderOperationDataType) {
                        if (attachment.OperationNo === binding.OperationNo) {
                            documentData.CustomerSignature = base64String;
                        }
                    } else if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
                        if (attachment.ItemNo === binding.ItemNo) {
                            documentData.CustomerSignature = base64String;
                        }
                    } else {
                        documentData.CustomerSignature = base64String;
                    }
                } else { //Any other attachment
                    attachments.push({'Description': document.Description, 'AttachmentSrc': base64String});
                }
            }
        }
    }

    documentData.Attachments = attachments;
}

function populateAddress(workOrder, results) {
    workOrder.ServiceAddress = '';

    if (results.length > 0) {
        let workOrderPartner = results.getItem(0);
        if (workOrderPartner.Address_Nav) {
            workOrder.ServiceAddress = workOrderPartner.Address_Nav;
        }
    }
    
}

function populateAllEquipment(workOrder) {
    let allEquipment = [];

    if (workOrder.Equipment && !allEquipment.some(equipment => equipment.EquipId === workOrder.Equipment.EquipId)) { //only add the equipment if it doesn't already exist
        allEquipment.push(workOrder.Equipment);
    }

    if (workOrder.WOObjectList_Nav.length > 0) {
        workOrder.WOObjectList_Nav.forEach(woObject => {
            if (woObject && woObject.EquipId && !allEquipment.some(equipment => equipment.EquipId === woObject.EquipId)) {
                allEquipment.push(woObject.Equipment_Nav);
            }
        });
    }

    if (workOrder.Operations.length > 0) {
        workOrder.Operations.forEach(operation => {

            if (operation.EquipmentOperation && !allEquipment.some(equipment => equipment.EquipId === operation.EquipmentOperation.EquipId)) {
                allEquipment.push(operation.EquipmentOperation);
            }

            if (operation.WOObjectList_Nav.length > 0) {
                operation.WOObjectList_Nav.forEach(operationObject => {
                    if (operationObject && operationObject.EquipId && !allEquipment.some(equipment => equipment.EquipId === operationObject.EquipId)) {
                        allEquipment.push(operationObject.Equipment_Nav);
                    }
                });
            }

        });
    }

    allEquipment.forEach(equipment => {
        equipment.AssetType = 'Equipment';
    });
    
    return allEquipment;
}

function populateAllFuncLocs(workOrder) {
    let allFlocs = [];

    if (workOrder.FunctionalLocation && !allFlocs.some(floc => floc.FuncLocId === workOrder.FunctionalLocation.FuncLocId)) { //only add the funcloc if it doesn't already exist
        allFlocs.push(workOrder.FunctionalLocation);
    }

    if (workOrder.WOObjectList_Nav.length > 0) {
        workOrder.WOObjectList_Nav.forEach(woObject => {
            if (woObject && woObject.FuncLocIdIntern && !allFlocs.some(floc => floc.FuncLocIdIntern === woObject.FuncLocIdIntern)) {
                allFlocs.push(woObject.FuncLoc_Nav);
            }
        });
    }

    if (workOrder.Operations.length > 0) {
        workOrder.Operations.forEach(operation => {

            if (operation.FunctionalLocationOperation && !allFlocs.some(floc => floc.FuncLocId === operation.FunctionalLocationOperation.FuncLocId)) {
                allFlocs.push(operation.FunctionalLocationOperation);
            }

            if (operation.WOObjectList_Nav.length > 0) {
                operation.WOObjectList_Nav.forEach(operationObject => {
                    if (operationObject && operationObject.FuncLocIdIntern && !allFlocs.some(floc => floc.FuncLocIdIntern === operationObject.FuncLocIdIntern)) {
                        allFlocs.push(operationObject.FuncLoc_Nav);
                    }
                });
            }

        });
    }

    allFlocs.forEach(floc => {
        floc.AssetType = 'Functional Location';
    });
    
    return allFlocs;
}

function populateAssets(workOrder) {
    const allEquipment = populateAllEquipment(workOrder);
    const allFuncLocs = populateAllFuncLocs(workOrder); 
    workOrder.Assets = [...allEquipment, ...allFuncLocs];
}

function populateUserName(workOrder, results) {
    workOrder.TechnicianName = '-';

    if (results.length > 0) {
        let sapUser = results.getItem(0);
        if (sapUser && sapUser.UserName) {
            workOrder.TechnicianName = sapUser.UserName;
        }
    }
    
}

function populateMaterials(order, results) {
    order.Components = [];

    for (let i=0; i < results.length; i++) {
        const material = results.getItem(i);
        material.UnitOfMeasure = material.UnitOfEntry;
        order.Components.push(material);
    }
}

function prepareS4OrderInfo(context, binding) {
    const serviceName = '/SAPAssetManager/Services/AssetManager.service';
    const expand = '$expand=RefObjects_Nav/Equipment_Nav,RefObjects_Nav/Material_Nav,RefObjects_Nav/FuncLoc_Nav,MobileStatus_Nav,LongText_Nav,Partners_Nav/BusinessPartner_Nav/Address_Nav,Document/Document,TransHistories_Nav/S4ServiceContract_Nav,S4ServiceConfirmationTranHistory_Nav';
    return context.read(serviceName, 'S4ServiceOrders', [], `$filter=ObjectID eq '${binding.ObjectID}'&${expand}`)
        .then(result => {
            if (result.length > 0) {
                let order = result.getItem(0);
                let promises = [];
        
                let userId = common.getSapUserName(context);
                let sapUserPromise = context.read(serviceName, 'SAPUsers', ['UserName'], `$filter=UserId eq '${userId}'`);
                promises.push(sapUserPromise);

                let attachmentsPromise = context.read(serviceName, 'S4ServiceOrderDocuments', [], `$filter=ObjectID eq '${order.ObjectID}' or HeaderID eq '${order.ObjectID}'&$expand=Document`);
                promises.push(attachmentsPromise);

                if (common.isDefined(order.S4ServiceConfirmationTranHistory_Nav)) {
                    let confirmationIds = order.S4ServiceConfirmationTranHistory_Nav.map(item => `ObjectID eq '${item.ObjectID}'`);
                    let confirmationsPromise = context.read(serviceName, 'S4ServiceConfirmations', [], `$filter=${confirmationIds.join(' or ')}&$expand=ServiceConfirmationItems_Nav/Product_Nav,ServiceConfirmationItems_Nav/AccountingInd_Nav`);
                    promises.push(confirmationsPromise);
                }

                return Promise.all(promises).then(([user, attachments, confirmations]) => {
                    let documentData = _getEmptyS4DocumentStructure();

                    populateUserName(documentData, user);
                    populateS4OrderHeaderData(documentData, order);
                    populateS4OrderItems(context, documentData, confirmations);
                    populateS4OrderAssets(documentData, order);
                    populateAttachmentsAndSignatures(context, documentData, attachments, binding);
                    populateS4OrderCustomerInfo(context, documentData, order);
                    populateS4OrderAdditionalInfo(documentData, order);

                    return Promise.resolve(documentData);
                });
            }
            return Promise.resolve(_getEmptyS4DocumentStructure());
        })
        .catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'Error getting data for pdf: ' + error);
            return Promise.resolve(_getEmptyS4DocumentStructure());
        });
}

function _getEmptyDocumentStructure() {
    return {
        OrderId: '',
        WOSales_Nav: {
            Customer_Nav: {
                Name1: '',
            },
            ContractDesc: '',
            ContractDateTo: '',
            ServiceProduct: '',
            ProductDesc: '',
            CustomerReference: '',
            ContractItemNum: '',
        },
        ServiceAddress: {
            HouseNum: '',
            Street: '',
            City: '',
            Region: '',
            PostalCode: '',
        },
        OrderDescription: '',
        TechnicianName: '',
        OrderMobileStatus_Nav: {
            MobileStatus: '',
        },   
        Assets: [], //EquipDesc or FuncLocDesc, EquipId or FuncLocId, ManufSerialNo or SerialNumber, Manufacturer, AssetType
        Operations: [], //OperationShortText, OperationNo, OperationMobileStatus_Nav.MobileStatus
        Components: [], //ComponentDesc, MaterialNum, WithdrawnQuantity, UnitOfMeasure
        HeaderLongText: [], //TextString
        Attachments: [],
        TechnicianSignature: '',
        CustomerSignature: '',
    };
}

function _getEmptyS4DocumentStructure() {
    return {
        ObjectID: '',
        Customer_Nav: {
            Name: '',
        },
        RefObjectID: '',
        RefObjectDesc: '',
        ContractDesc: '',
        ServiceAddress: {
            HouseNum: '',
            Street: '',
            City: '',
            Region: '',
            PostalCode: '',
        },
        OrderDescription: '',
        TechnicianName: '',
        OrderMobileStatus_Nav: {
            MobileStatus: '',
        }, 
        Assets: [], //EquipDesc or FuncLocDesc, EquipId or FuncLocId, ManufSerialNo or SerialNumber, Manufacturer, AssetType
        ConfirmedServiceItems: [], //
        ConfirmedMaterialItems: [], //
        HeaderLongText: [], //TextString
        Attachments: [],
        TechnicianSignature: '',
        CustomerSignature: '',
    };
}

function populateS4OrderHeaderData(documentData, serviceOrder) {
    documentData.OrderDescription = serviceOrder.Description;
    documentData.ObjectID = serviceOrder.ObjectID;

    if (serviceOrder.MobileStatus_Nav) {
        documentData.OrderMobileStatus_Nav.MobileStatus = serviceOrder.MobileStatus_Nav.MobileStatus;
    }
    
    if (serviceOrder.LongText_Nav && serviceOrder.LongText_Nav.length > 0) {
        documentData.HeaderLongText.push({'TextString': serviceOrder.LongText_Nav[0].TextString});
    }
}

function populateS4OrderItems(context, documentData, confirmations) {
    const serviceItemCategories = S4ServiceLibrary.getServiceProductItemCategories(context);
    const materialItemCategories = S4ServiceLibrary.getServiceProductPartCategories(context);

    if (common.isDefined(confirmations)) {
        confirmations.forEach(confirmation => {
            let confirmationItems = confirmation.ServiceConfirmationItems_Nav;
            if (common.isDefined(confirmationItems)) {
                confirmationItems.forEach(confItem => {
                    let itemDetails = {
                        'ObjectID': confItem.ObjectID,
                        'ItemNo': confItem.ItemNo,
                        'ProductID': confItem.ProductID,
                        'ProductDesc': confItem.Product_Nav?.Description || '',
                        'AccountingInd': confItem.Product_Nav?.Description || '',
                    };
    
                    if (serviceItemCategories.includes(confItem.ItemObjectType)) {
                        documentData.ConfirmedServiceItems.push(Object.assign({}, itemDetails));
                    } else if (materialItemCategories.includes(confItem.ItemObjectType)) {
                        documentData.ConfirmedMaterialItems.push(Object.assign({}, itemDetails, {
                            'Quantity': confItem.Quantity,
                            'QuantityUOM': confItem.QuantityUOM,
                        }));
                    }
                });
            }
        });
    }
}

function populateS4OrderCustomerInfo(context, documentData, serviceOrder) {
    const soldToPartyType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/SoldToPartyType.global').getValue();
    if (common.isDefined(serviceOrder.Partners_Nav)) {
        let soldToParty = serviceOrder.Partners_Nav.find(partner => partner.PartnerFunction === soldToPartyType);
        if (common.isDefined(soldToParty) && common.isDefined(soldToParty.BusinessPartner_Nav)) {
            let BP = soldToParty.BusinessPartner_Nav;
            let name = BP.OrgName1 || BP.FullName || BP.FirstName + ' ' + BP.LastName;
            documentData.Customer_Nav.Name = name.trim();

            if (common.isDefined(BP.Address_Nav)) {
                documentData.ServiceAddress = BP.Address_Nav;
            }
        }
    }
}

function populateS4OrderAdditionalInfo(documentData, serviceOrder) {
    if (common.isDefined(serviceOrder.TransHistories_Nav)) {
        let contractObject = serviceOrder.TransHistories_Nav.find(history => common.isDefined(history.S4ServiceContract_Nav));
        if (common.isDefined(contractObject)) {
            documentData.ContractDesc = contractObject.S4ServiceContract_Nav.Description;
        }
    }
}

function populateS4OrderAssets(documentData, serviceOrder) {
    let assets = [];
    if (common.isDefined(serviceOrder.RefObjects_Nav)) {
        serviceOrder.RefObjects_Nav.forEach(refObject => {
            const isMainObject = refObject.MainObject === 'X';
            if (common.isDefined(refObject.Equipment_Nav)) {
                if (isMainObject) {
                    documentData.RefObjectID = refObject.Equipment_Nav.EquipId;
                    documentData.RefObjectDesc = refObject.Equipment_Nav.EquipDesc;
                }
                assets.push(Object.assign(refObject.Equipment_Nav, { AssetType: 'Equipment' }));
            } else if (common.isDefined(refObject.FuncLoc_Nav)) {
                if (isMainObject) {
                    documentData.RefObjectID = refObject.FuncLoc_Nav.FuncLocId;
                    documentData.RefObjectDesc = refObject.FuncLoc_Nav.FuncLocDesc;
                }
                assets.push(Object.assign(refObject.FuncLoc_Nav, { AssetType: 'Functional Location' }));
            } else if (common.isDefined(refObject.Material_Nav)) {
                if (isMainObject) {
                    documentData.RefObjectID = refObject.Material_Nav.MaterialNum;
                    documentData.RefObjectDesc = refObject.Material_Nav.Description;
                }
            }
        });
    }
    
    documentData.Assets = assets;
}
