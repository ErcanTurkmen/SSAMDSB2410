import libCommon from '../../../Common/Library/CommonLibrary';
import libDoc from '../../../Documents/DocumentLibrary';
import Logger from '../../../Log/Logger';
import S4ServiceLibrary from '../../S4ServiceLibrary';
import S4ServiceOrderControlsLibrary from '../../S4ServiceOrderControlsLibrary';
import ServiceOrderObjectType from '../../ServiceOrderObjectType';

export default function ServiceOrderItemBatchCreate(context, itemData) {

    //set up the pending_* counter into client data
    setupPrimaryEntityPendingCounter(context);

    // check if we are in ServiceOrder Create Changeset
    if (S4ServiceLibrary.isOnSOChangeset(context)) {
        //create all primary and dependent entities
        return runPrimaryEntityActions(context, itemData).then(() => {
            return Promise.all(getDependentEntityActions(context, itemData)).then(() => {
                libCommon.setStateVariable(context, 'ObjectCreatedName', 'ServiceOrder');
                return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
            });
        });
    } else {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/ServiceItems/ServiceItemCreate.action',
            'Properties': {
                'Properties': itemData,
            },
        })
        .then(response => {
            let dataObject = JSON.parse(response.data);
            libCommon.setStateVariable(context, 'LocalId', dataObject.ObjectID);
            libCommon.setStateVariable(context, 'lastLocalItemId', dataObject.ItemNo);
            libCommon.setStateVariable(context, 'CreateFunctionalLocation', dataObject);
            const isTraveExpence = S4ServiceLibrary.isViewModeTravelExpence(context);

            return Promise.all(getItemDependentEntityActions(context, itemData)).then(() => {
                if (!isTraveExpence) {
                    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/ServiceItems/ServiceItemCreateSuccessMessage.action');
                    });
                } else {
                    libCommon.setStateVariable(context, 'ObjectCreatedName', 'TravelExpense');
                    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
                }
            });
        }).catch((error) => {
            Logger.error('Create Service Item', error);
            return context.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
        });
    }
}


/**
 * execute the ServiceOrder and Item create actions.
 * @param {*} context MDK Page - CreateUpdateServiceItemScreen
 * @param {*} item data object
 * @returns {Promise} executeAction Promise
 */
function runPrimaryEntityActions(context, itemData) {
    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/CreateUpdate/ServiceOrderCreate.action').then((response) => {
        let dataObject = JSON.parse(response.data);
        libCommon.setStateVariable(context, 'LocalId', dataObject.ObjectID);
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/ServiceItems/ServiceItemCreate.action',
            'Properties': {
                'Properties': itemData,
            },
        });
    });
}

/**
 * get the (serviceorder and item)'s dependent entities create action
 * S4ServiceOrderLongText, S4ServiceOrderRefObj
 * @param {*} context 
 * @returns {Array} array of promises
 */
function getDependentEntityActions(context, itemData) {
    let promises = [];

    //ServiceOrderSoldToParty
    const soldToParty = S4ServiceOrderControlsLibrary.getSoldToParty(context);
    const soldToPartyType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/SoldToPartyType.global').getValue();
    if (soldToParty) {
        promises.push(context.executeAction({
            'Name': '/SAPAssetManager/Actions/ServiceOrders/S4ServiceOrderPartnerCreate.action',
            'Properties': {
                'Properties': {
                    'ObjectID': libCommon.getStateVariable(context, 'LocalId'),
                    'ObjectType': ServiceOrderObjectType(context),
                    'BusinessPartnerID': soldToParty,
                    'PartnerFunction': soldToPartyType,
                },
                'CreateLinks': [
                    {
                        'Property': 'S4ServiceOrder_Nav',
                        'Target': {
                            'EntitySet': 'S4ServiceOrders',
                            'ReadLink': 'pending_1',
                        },
                    },
                ],
                'Headers': {
                    'OfflineOData.RemoveAfterUpload': 'true',
                    'OfflineOData.TransactionID': libCommon.getStateVariable(context, 'LocalId'),
                },
            },
        }));
    }
    
    //ServiceOrderBillToParty
    const billToParty = S4ServiceOrderControlsLibrary.getBillToParty(context);
    const billToPartyType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/BillToPartyType.global').getValue();
    if (billToParty) {
        promises.push(context.executeAction({
            'Name': '/SAPAssetManager/Actions/ServiceOrders/S4ServiceOrderPartnerCreate.action',
            'Properties': {
                'Properties': {
                    'ObjectID': libCommon.getStateVariable(context, 'LocalId'),
                    'ObjectType': ServiceOrderObjectType(context),
                    'BusinessPartnerID': billToParty,
                    'PartnerFunction': billToPartyType,
                },
                'CreateLinks': [
                    {
                        'Property': 'S4ServiceOrder_Nav',
                        'Target': {
                            'EntitySet': 'S4ServiceOrders',
                            'ReadLink': 'pending_1',
                        },
                    },
                ],
                'Headers': {
                    'OfflineOData.RemoveAfterUpload': 'true',
                    'OfflineOData.TransactionID': libCommon.getStateVariable(context, 'LocalId'),
                },
            },
        }));
    }
    
    //ServiceOrderNote
    const note = libCommon.getTargetPathValue(context, '#Page:ServiceOrderCreateUpdatePage/#Control:LongTextNote/#Value');
    if (note) {
        promises.push(context.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateDuringSOCreate.action'));
    }

    //ServiceOrderProduct
    const product = libCommon.getTargetPathValue(context, '#Page:ServiceOrderCreateUpdatePage/#Control:ProductLstPkr/#SelectedValue');
    if (product) {
        promises.push(context.executeAction('/SAPAssetManager/Actions/ReferenceObjects/RefObjectCreateDuringSOCreate.action'));
    }

    //ServiceOrderEquipment
    const equipment = S4ServiceOrderControlsLibrary.getEquipmentValue(context);
    if (equipment) {
        promises.push(context.executeAction({
            'Name': '/SAPAssetManager/Actions/ReferenceObjects/RefObjectCreateDuringSOCreate.action',
            'Properties': {
                'Properties': {
                    'ProductID': '',
                    'EquipID': equipment,
                },
                'CreateLinks': [
                    {
                        'Property': 'S4ServiceOrder_Nav',
                        'Target': {
                            'EntitySet': 'S4ServiceOrders',
                            'ReadLink': 'pending_1',
                        },
                    },
                    {
                        'Property': 'Equipment_Nav',
                        'Target': {
                            'EntitySet': 'MyEquipments',
                            'ReadLink': `MyEquipments('${equipment}')`,
                        },
                    },
                ],
            },
        }));
    }

    //ServiceOrderFloc
    const floc = S4ServiceOrderControlsLibrary.getFunctionalLocationValue(context);
    if (floc) {
        promises.push(context.executeAction({
            'Name': '/SAPAssetManager/Actions/ReferenceObjects/RefObjectCreateDuringSOCreate.action',
            'Properties': {
                'Properties': {
                    'ProductID': '',
                    'FLocID': floc,
                },
                'CreateLinks': [
                    {
                        'Property': 'S4ServiceOrder_Nav',
                        'Target': {
                            'EntitySet': 'S4ServiceOrders',
                            'ReadLink': 'pending_1',
                        },
                    },
                    {
                        'Property': 'FuncLoc_Nav',
                        'Target': {
                            'EntitySet': 'MyFunctionalLocations',
                            'ReadLink': `MyFunctionalLocations('${floc}')`,
                        },
                    },
                ],
            },
        }));
    }

    //Item note 
    promises.push(_createItemNote(context, itemData));

    return promises;
}

function getItemDependentEntityActions(context, itemData) {
    let promises = [];

    //ServiceItem ServiceContractItem connection
    const serviceContractId = libCommon.getControlValue(libCommon.getControlProxy(context, 'ServiceContractLstPkr'));
    if (serviceContractId) {
        promises.push(
            context.read(
                '/SAPAssetManager/Services/AssetManager.service',
                'S4ServiceContracts',
                [],
                `$filter=ObjectID eq '${serviceContractId}'&$select=ObjectType`,
            ).then((result) => result.getItem(0) && context.executeAction({
                'Name': '/SAPAssetManager/Actions/ReferenceObjects/TransHistoryCreateDuringSICreate.action',
                'Properties': {
                    'Properties': {
                        'ObjectID': libCommon.getStateVariable(context, 'LocalId'),
                        'ObjectType': ServiceOrderObjectType(context),
                        'RelatedObjectID': serviceContractId,
                        'RelatedObjectType': result.getItem(0).ObjectType,
                    },
                    'CreateLinks': [
                        {
                            'Property': 'S4ServiceOrder_Nav',
                            'Target': {
                                'EntitySet': 'S4ServiceOrders',
                                'ReadLink': `S4ServiceOrders(ObjectID='${libCommon.getStateVariable(context, 'LocalId')}',ObjectType='${ServiceOrderObjectType(context)}')`,
                            },
                        },
                        {
                            'Property': 'S4ServiceContract_Nav',
                            'Target': {
                                'EntitySet': 'S4ServiceContracts',
                                'ReadLink': `S4ServiceContracts(ObjectID='${serviceContractId}',ObjectType='${result.getItem(0).ObjectType}')`,
                            },
                        },
                    ],
                },
            }),
        ));

        const serviceContractItemNo = libCommon.getControlValue(libCommon.getControlProxy(context, 'ServiceContractItemLstPkr'));
        if (serviceContractItemNo && itemData.ItemObjectType) {
            promises.push(
                context.read(
                    '/SAPAssetManager/Services/AssetManager.service',
                    'S4ServiceContractItems',
                    [],
                    `$filter=ObjectID eq '${serviceContractId}' and ItemNo eq '${serviceContractItemNo}'&$select=ObjectType,ItemObjectType`,
                ).then((result) => result.getItem(0) && context.executeAction({
                    'Name': '/SAPAssetManager/Actions/ReferenceObjects/TransHistoryCreateDuringSICreate.action',
                    'Properties': {
                        'Properties': {
                            'ObjectID': libCommon.getStateVariable(context, 'LocalId'),
                            'ItemNo': libCommon.getStateVariable(context, 'lastLocalItemId'),
                            'ObjectType': itemData.ItemObjectType,
                            'RelatedObjectID': serviceContractId,
                            'RelatedObjectType': result.getItem(0).ItemObjectType,
                            'RelatedItemNo': serviceContractItemNo,
                        },
                        'CreateLinks': [
                            {
                                'Property': 'S4ServiceItem_Nav',
                                'Target': {
                                    'EntitySet': 'S4ServiceItems',
                                    'ReadLink': 'pending_1',
                                },
                            },
                            {
                                'Property': 'S4ServiceContractItem_Nav',
                                'Target': {
                                    'EntitySet': 'S4ServiceContractItems',
                                    'ReadLink': `S4ServiceContractItems(ItemNo='${serviceContractItemNo}',ObjectID='${serviceContractId}',ObjectType='${result.getItem(0).ObjectType}')`,
                                },
                            },
                        ],
                    },
                }),
            ));
        }
    }

    //Item note 
    promises.push(_createItemNote(context, itemData));

    return promises;
}

/**
 * Setup the pending_* counter into the ClientData, whenever needed, they can be referenced using targetpath
 * such as #ClientData/#Property:PendingCounter/#Property:S4ServiceOrders
 * @param {*} context 
 */
function setupPrimaryEntityPendingCounter(context) {

    let result;

    if (S4ServiceLibrary.isOnSOChangeset(context)) {
        result = {
            S4ServiceOrders: 'pending_1',
            S4ServiceItems: 'pending_2',
        };
    } else {
        result = {
            S4ServiceItems: 'pending_1',
        };
    }

    context.getClientData().PendingCounter = result;
}


function _createItemNote(context, itemData) {
    return _createItemDocuments(context, itemData).then(() => {
        let note = libCommon.getControlProxy(context, 'LongTextNote').getValue();
        if (note) {
            return context.executeAction('/SAPAssetManager/Actions/ServiceItems/ServiceItemNoteCreate.action');
        } else {
            return Promise.resolve();
        }
    });
}

function _createItemDocuments(context, itemData) {
    let attachmentDescription = libCommon.getControlProxy(context, 'AttachmentDescription').getValue() || '';
    let attachments = libCommon.getControlProxy(context, 'Attachment').getValue();

    libCommon.setStateVariable(context, 'DocDescriptionItem', attachmentDescription);
    libCommon.setStateVariable(context, 'DocItem', attachments);
    libCommon.setStateVariable(context, 'ObjectLinkItem', itemData.ItemObjectType);
    libCommon.setStateVariable(context, 'ClassItem', 'ServiceOrder');
    libCommon.setStateVariable(context, 'ObjectKeyItem', 'ItemNo');
    libCommon.setStateVariable(context, 'entitySetItem', 'S4ServiceOrderDocuments');
    libCommon.setStateVariable(context, 'parentPropertyItem', 'S4ServiceItem_Nav');
    libCommon.setStateVariable(context, 'parentEntitySetItem', 'S4ServiceItems');
    libCommon.setStateVariable(context, 'attachmentCountItem', libDoc.validationAttachmentCount(context));
    return Promise.resolve();
}
