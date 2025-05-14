import CommonLibrary from '../../Common/Library/CommonLibrary';
import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';
import nilGuid from '../../Common/nilGuid';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import ServiceConfirmationItemCreateNav from './ServiceConfirmationItemCreateNav';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import GetConfirmationObjectType from './Data/GetConfirmationObjectType';
import GetServiceConfirmationItemLocalID from './Data/GetServiceConfirmationItemLocalID';
import GetServiceConfirmationLocalID from './Data/GetServiceConfirmationLocalID';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default class ServiceConfirmationLibrary {
    constructor() {
        this._instance = null;
        this.resetAllFlags();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    resetPageFlow() {
        this._pages = {
            startPage: ServiceConfirmationLibrary.confirmationFlag, // the first shown page
            actionPage: ServiceConfirmationLibrary.itemsFlag, // the expected action page: item or ad-hoc item
        };
    }

    resetConfirmationDataObject() {
        this._confirmation = {
            link: '', // odata link to create confirmation
            headerData: {}, // confirmation data
            relatedObjectsData: {}, // related confirmation objects data
            prevRelatedObjectsData: {},  // edit flow: initial related confirmation objects data
            itemData: {}, // confirmation item data
        };
    }

    resetAllFlags() {
        this._confirmations = []; // select confirmation screen: array of an order related confirmations
        this._statusFlow = ''; // confirm or hold status flow 
        this.resetConfirmationDataObject();
        this.resetPageFlow();
    }

    isStartPageIsConfirmationPage() {
        return this.getStartPage() === ServiceConfirmationLibrary.confirmationFlag;
    }

    getStartPage() {
        return this._pages.startPage;
    }

    setStartPageFlag(page) {
        this._pages.startPage = page;
    }

    setActionPageFlag(page) {
        this._pages.actionPage = page;
    }

    getActionPage() {
        return this._pages.actionPage;
    }

    setStatus(status) {
        this._statusFlow = status;
    }

    isConfirmFlow() {
        return this._statusFlow === ServiceConfirmationLibrary.confirmFlow;
    }

    isHoldFlow() {
        return this._statusFlow === ServiceConfirmationLibrary.holdFlow;
    }

    storeConfirmationFilledValues(data) {
        let headerData = {};
        Object.keys(data).forEach(key => {
            if (data[key] && data[key] !== nilGuid()) {
                headerData[key] = data[key];
            }
        });
        this._confirmation.headerData = headerData;
    }

    storeItemFilledValues(data) {
        let itemData = {};
        Object.keys(data).forEach(key => {
            if (data[key] && data[key] !== nilGuid()) {
                itemData[key] = data[key];
            }
        });
        this._confirmation.itemData = itemData;
    }

    updateItemFieldValue(propertyName, newValue) {
        if (this._confirmation.itemData && propertyName) {
            this._confirmation.itemData[propertyName] = newValue;
        }
    }

    storeComponentRelatedObjectIds(data) {
        this._confirmation.relatedObjectsData = data;
    }

    storePrevComponentRelatedObjectIds(data) {
        this._confirmation.prevRelatedObjectsData = data;
    }

    getConfirmationLink() {
        return this._confirmation.link;
    }

    setConfirmationLink(link) {
        this._confirmation.link = link;
    }

    getRelatedConfirmations() {
        return this._confirmations;
    }

    pushRelatedConfirmations(id) {
        this._confirmations.push(id);
    }

    getConnectedServiceOrder() {
        return this._confirmation.relatedObjectsData ? this._confirmation.relatedObjectsData.ServiceOrder : null;
    }

    getComponentItemData() {
        return this._confirmation.itemData;
    }

    openStartPage(context, customBinding) {
        CommonLibrary.setOnCreateUpdateFlag(context, 'CREATE');
        CommonLibrary.setOnChangesetFlag(context, false);

        const binding = customBinding || context.binding || {};
        // Opens from Confirmation Details screen
        if (binding && [
                context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceConfirmation.global').getValue(),
                context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceConfirmationItem.global').getValue(),
            ].includes(binding['@odata.type'])) {
            const isItem = binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceConfirmationItem.global').getValue();
            const confirmation = isItem ? binding.S4ServiceConfirmation_Nav : binding;    

            CommonLibrary.setStateVariable(context, 'LocalId', confirmation.ObjectID);
            this.setConfirmationLink(confirmation['@odata.readLink']);

            if (this.getActionPage() === ServiceConfirmationLibrary.itemHocFlag) {
                this.setStartPageFlag(ServiceConfirmationLibrary.itemHocFlag);
                return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/Item/ServiceHocConfirmationItemCreateNav.action');
            }
            this.setStartPageFlag(ServiceConfirmationLibrary.itemsFlag);

            if (isItem) {
                context.getPageProxy().setActionBinding(confirmation);
            }
            return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationSelectItemNav.action');
        }

        // Opens from Service Order Details, Service Item Details or Confirmations List screen
        let orderID = binding?.ObjectID || '';
        return this.countOrderConfirmations(context, orderID).then(hasConfirmations => {
            if (hasConfirmations) {
                if (hasConfirmations > 1) {
                    if (this.getActionPage() !== ServiceConfirmationLibrary.itemHocFlag) {
                        if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
                            this.setActionPageFlag(ServiceConfirmationLibrary.itemFlag);
                        } else {
                            this.setActionPageFlag(ServiceConfirmationLibrary.itemsFlag);
                        }
                    }

                    this.setStartPageFlag(ServiceConfirmationLibrary.confirmationsFlag);
                    return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationSelectNav.action');
                } else if (this.getActionPage() === ServiceConfirmationLibrary.itemHocFlag) {
                    this.setStartPageFlag(ServiceConfirmationLibrary.itemHocFlag);
                    return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/Item/ServiceHocConfirmationItemCreateNav.action');
                } else if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
                    this.setStartPageFlag(ServiceConfirmationLibrary.itemFlag);
                    return ServiceConfirmationItemCreateNav(context, binding);
                } else {
                    this.setStartPageFlag(ServiceConfirmationLibrary.itemsFlag);
                    return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationSelectItemNav.action');
                }
            } else {
                this.setStartPageFlag(ServiceConfirmationLibrary.confirmationFlag);
                CommonLibrary.setOnChangesetFlag(context, true);

                if (IsCompleteAction(context)) {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationCreateUpdateNav.action');
                } else {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationCreateChangeSet.action');
                }
            }
        });
    }

    openConfirmatioPageForConfirmFlow(context) {
        this.setStatus(ServiceConfirmationLibrary.confirmFlow);
        return this.openStartPage(context);
    }

    openConfirmatioPageForHoldFlow(context) {
        this.setStatus(ServiceConfirmationLibrary.holdFlow);
        return this.openStartPage(context);
    }

    countOrderConfirmations(context, orderID) {
        if (!orderID) return Promise.resolve(0);

        let categories = S4ServiceLibrary.getServiceConfirmationCategories(context);
        let query = `$expand=S4ServiceConfirmation_Nav/MobileStatus_Nav&$filter=RelatedObjectID eq '${orderID}'`;

        if (categories && categories.length) {
            let categoriesQuery = categories.map(category => {
                return `ObjectType eq '${category}'`;
            });
            query += ' and (' + categoriesQuery.join(' or ') + ')';
        }

        return context.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceConfirmationTranHistories', [], query).then(result => {
            let count = 0;

            if (result.length) {
                const COMPLETE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
                for (let i = 0; i < result.length; i++) {
                    if (result.getItem(i).S4ServiceConfirmation_Nav && result.getItem(i).S4ServiceConfirmation_Nav.MobileStatus_Nav &&
                        result.getItem(i).S4ServiceConfirmation_Nav.MobileStatus_Nav.MobileStatus !== COMPLETE) {
                        CommonLibrary.setStateVariable(context, 'LocalId', result.getItem(i).S4ServiceConfirmation_Nav.ObjectID);
                        this.setConfirmationLink(result.getItem(i).S4ServiceConfirmation_Nav['@odata.readLink']);
                        this.pushRelatedConfirmations(result.getItem(i).S4ServiceConfirmation_Nav.ObjectID);
                        count += 1;
                    }
                }
            }

            return count;
        });
    }

    createConfirmation(context) {
        let action = context.executeAction({
            'Name': '/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationCreate.action',
            'Properties': {
                'Properties': this._confirmation.headerData,
            },
        }).then((response) => {
            this.setConfirmationLink(JSON.parse(response.data)['@odata.readLink']);

            if (IsCompleteAction(context)) {
                WorkOrderCompletionLibrary.updateStepState(context, 'confirmation', {
                    data: response.data,
                    link: JSON.parse(response.data)['@odata.editLink'],
                    value: context.localizeText('done'),
                });
            }

            return this.createConfirmationRelatedObjects(context);
        }).then(() => {
            return this.createConfirmationDocuments(context);
        }).then(() => {
            return this.createConfirmationNote(context);
        }).then(() => {
            return this.createConfirmationItem(context);
        });

        return action;
    }

    createConfirmationRelatedObjects(context) {
        let promises = [];

        let productId = this._confirmation.relatedObjectsData.Product;
        let confirmationLink = this._confirmation.link;

        if (productId) {
            promises.push(this.createProduct(context, productId, confirmationLink));
        }

        let floc = this._confirmation.relatedObjectsData.FunctionalLocation;
        if (floc) {
            promises.push(this.createFLOC(context, floc, confirmationLink));
        }

        let equipment = this._confirmation.relatedObjectsData.Equipment;
        if (equipment) {
            promises.push(this.createEquipment(context, equipment, confirmationLink));
        }

        let order = this._confirmation.relatedObjectsData.ServiceOrder;
        if (order) {
            let type = this._confirmation.headerData.ObjectType;
            let action;
            if (CommonLibrary.isCurrentReadLinkLocal(order)) {
                action = context.read('/SAPAssetManager/Services/AssetManager.service', order, [], '$select=ObjectID').then(result => {
                    return result.length ? result.getItem(0).ObjectID : '';
                });
            } else {
                action = Promise.resolve(SplitReadLink(order).ObjectID);
            }

            promises.push(Promise.resolve(action).then(orderId => {
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationCreateRelatedObject.action',
                    'Properties': {
                        'Target': {
                            'EntitySet': 'S4ServiceConfirmationTranHistories',
                        },
                        'Properties': {
                            'ObjectID': '/SAPAssetManager/Rules/ServiceConfirmations/CreateUpdate/Data/GetServiceConfirmationLocalID.js',
                            'HeaderID': '/SAPAssetManager/Rules/ServiceConfirmations/CreateUpdate/Data/GetServiceConfirmationTranHistoriesLocalID.js',
                            'ObjectType': type,
                            'RelatedObjectID': orderId,
                        },
                        'CreateLinks': [
                            {
                                'Property': 'S4ServiceConfirmation_Nav',
                                'Target': {
                                    'EntitySet': 'S4ServiceConfirmations',
                                    'ReadLink': confirmationLink,
                                },
                            },
                            {
                                'Property': 'S4ServiceOrder_Nav',
                                'Target': {
                                    'EntitySet': 'S4ServiceOrders',
                                    'ReadLink': order,
                                },
                            },
                        ],
                    },
                });
            }));
        }

        return Promise.all(promises);
    }

    //add transaction histories for service item
    createConfirmationItemRelatedObjects(context, itemData) {
        let promises = [];
        let confirmationLink = this._confirmation.link;
        let order = this._confirmation.relatedObjectsData.ServiceOrder || context.binding?.S4ServiceOrder_Nav?.['@odata.readLink'];
        let action;
        if (order) {
            if (CommonLibrary.isCurrentReadLinkLocal(order)) {
                action = context.read('/SAPAssetManager/Services/AssetManager.service', order, [], '$select=ObjectID').then(result => {
                    return result.length ? result.getItem(0).ObjectID : '';
                });
            } else {
                action = Promise.resolve(SplitReadLink(order).ObjectID);
            }
        }
        if (itemData) {
            promises.push(Promise.resolve(action).then(orderId => {
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationCreateRelatedObject.action',
                    'Properties': {
                        'Target': {
                            'EntitySet': 'S4ServiceConfirmationTranHistories',
                        },
                        'Properties': {
                            'ObjectID': itemData.ObjectID,
                            'HeaderID': '/SAPAssetManager/Rules/ServiceConfirmations/CreateUpdate/Data/GetServiceConfirmationTranHistoriesLocalID.js',
                            'ObjectType': itemData.ObjectType,
                            'RelatedObjectID': orderId,
                            'RelatedItemNo': context.binding.ItemNo,
                            'RelatedObjectType': context.binding.ItemObjectType,
                            'ItemNo': itemData.ItemNo,
                        },
                        'CreateLinks': [
                            {
                                'Property': 'S4ServiceConfirmation_Nav',
                                'Target': {
                                    'EntitySet': 'S4ServiceConfirmations',
                                    'ReadLink': confirmationLink,
                                },
                            },
                        ],
                    },
                });
            }));
        }

        return Promise.all(promises);
    }


    createProduct(context, productId, confirmationLink) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationCreateRelatedObject.action',
            'Properties': {
                'Properties': {
                    'ObjectID': '/SAPAssetManager/Rules/ServiceConfirmations/CreateUpdate/Data/GetServiceConfirmationLocalID.js',
                    'ProductID': productId,
                },
                'CreateLinks': [
                    {
                        'Property': 'S4ServiceConfirmation_Nav',
                        'Target':
                        {
                            'EntitySet': 'S4ServiceConfirmations',
                            'ReadLink': confirmationLink,
                        },
                    },
                    {
                        'Property': 'Material_Nav',
                        'Target':
                        {
                            'EntitySet': 'Materials',
                            'ReadLink': `Materials('${productId}')`,
                        },
                    },
                ],
            },
        });
    }

    createFLOC(context, floc, confirmationLink) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationCreateRelatedObject.action',
            'Properties': {
                'Properties': {
                    'ObjectID': '/SAPAssetManager/Rules/ServiceConfirmations/CreateUpdate/Data/GetServiceConfirmationLocalID.js',
                    'FLocID': floc,
                },
                'CreateLinks': [
                    {
                        'Property': 'S4ServiceConfirmation_Nav',
                        'Target':
                        {
                            'EntitySet': 'S4ServiceConfirmations',
                            'ReadLink': confirmationLink,
                        },
                    },
                    {
                        'Property': 'MyFunctionalLocation_Nav',
                        'Target':
                        {
                            'EntitySet': 'MyFunctionalLocations',
                            'ReadLink': `MyFunctionalLocations('${floc}')`,
                        },
                    },
                ],
            },
        });
    }

    createEquipment(context, equipment, confirmationLink) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationCreateRelatedObject.action',
            'Properties': {
                'Properties': {
                    'ObjectID': '/SAPAssetManager/Rules/ServiceConfirmations/CreateUpdate/Data/GetServiceConfirmationLocalID.js',
                    'EquipID': equipment,
                },
                'CreateLinks': [
                    {
                        'Property': 'S4ServiceConfirmation_Nav',
                        'Target':
                        {
                            'EntitySet': 'S4ServiceConfirmations',
                            'ReadLink': confirmationLink,
                        },
                    },
                    {
                        'Property': 'MyEquipment_Nav',
                        'Target':
                        {
                            'EntitySet': 'MyEquipments',
                            'ReadLink': `MyEquipments('${equipment}')`,
                        },
                    },
                ],
            },
        });
    }

    createConfirmationNote(context) {
        let action = Promise.resolve();
        let note = this._confirmation.relatedObjectsData.Note;

        if (note) {
            action = context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationNoteCreate.action');
        }

        return action;
    }

    createConfirmationDocuments(context) {
        let attachmentDescription = this._confirmation.relatedObjectsData.AttachmentDescription;
        let attachments = this._confirmation.relatedObjectsData.Attachments;
        let count = this._confirmation.relatedObjectsData.AttachmentsCount;

        CommonLibrary.setStateVariable(context, 'DocDescription', attachmentDescription);
        CommonLibrary.setStateVariable(context, 'Doc', attachments);
        CommonLibrary.setStateVariable(context, 'Class', 'Confirmation');
        CommonLibrary.setStateVariable(context, 'ObjectKey', 'ObjectID');
        CommonLibrary.setStateVariable(context, 'entitySet', 'S4ServiceConfirmationDocuments');
        CommonLibrary.setStateVariable(context, 'parentProperty', 'S4ServiceConfirmation_Nav');
        CommonLibrary.setStateVariable(context, 'parentEntitySet', 'S4ServiceConfirmations');
        CommonLibrary.setStateVariable(context, 'attachmentCount', count);

        return Promise.resolve();
    }

    createConfirmationItem(context) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/ServiceConfirmations/Item/ServiceConfirmationItemCreate.action',
            'Properties': {
                'Properties': this._confirmation.itemData,
            },
        }).then((result) => {
            if (IsCompleteAction(context)) {
                WorkOrderCompletionLibrary.updateStepState(context, 'confirmation_item', {
                    data: result.data,
                    link: JSON.parse(result.data)['@odata.editLink'],
                    value: context.localizeText('done'),
                });
            }
            return this.createConfirmationItemRelatedObjects(context, JSON.parse(result.data));
        });
    }

    static async getConfirmationProcessType(context, orderLink) {
        const defaultType = 'SRVC';
        if (ValidationLibrary.evalIsEmpty(orderLink) && !ValidationLibrary.evalIsEmpty(context.binding)) {
            let binding = context.binding;
            if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
                if (!ValidationLibrary.evalIsEmpty(binding.S4ServiceOrder_Nav)) {
                    orderLink = binding.S4ServiceOrder_Nav['@odata.readLink'];
                } else {
                    const s4ServiceItem = await context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], '$expand=S4ServiceOrder_Nav');
                    if (s4ServiceItem && s4ServiceItem.length > 0) {
                        orderLink = s4ServiceItem.getItem(0).S4ServiceOrder_Nav['@odata.readLink'];
                    }
                }
            } else if (binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
                orderLink = binding['@odata.readLink'];
            }
        }
        if (CommonLibrary.getPageName(context) === 'CreateUpdateServiceConfirmationScreen') {
            orderLink = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ServiceOrderLstPkr'));
        }
        if (!orderLink) return Promise.resolve(defaultType);

        return context.read('/SAPAssetManager/Services/AssetManager.service', orderLink, [], '$select=ProcessType').then(result => {
            if (result.length) {
                let type = result.getItem(0).ProcessType;
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'ServiceProcessTypes', [], `$filter=TransactionType eq '${type}'`).then(types => {
                    if (types.length) {
                        return types.getItem(0).TransactionType1 || defaultType;
                    }

                    return defaultType;
                });
            }

            return defaultType;
        });
    }

    static async getOrderProcessType(context, orderLink) {
        const defaultType = 'SRVO';
        if (!orderLink) return Promise.resolve(defaultType);

        const order = await context.read('/SAPAssetManager/Services/AssetManager.service', orderLink, ['ProcessType'], '').then(result => result.length ? result.getItem(0) : {});
        return order.ProcessType || defaultType;
    }

    static async getQuotationProcessType(context, quotationLink) {
        const defaultType = 'SRVQ';
        if (!quotationLink) return Promise.resolve(defaultType);

        const order = await context.read('/SAPAssetManager/Services/AssetManager.service', quotationLink, ['ProcessType'], '').then(result => result.length ? result.getItem(0) : {});
        return order.ProcessType || defaultType;
    }

    getNoteValue() {
        return this._confirmation.relatedObjectsData.Note || '';
    }

    getNoteType() {
        return this._confirmation.relatedObjectsData.NoteType || '';
    }

    isProductNotEqual(prevObjects, currentObjects) {
        return (prevObjects.Material && prevObjects.Material.MaterialNum) !== currentObjects.Product;
    }

    isEquipmentNotEqual(prevObjects, currentObjects) {
        return (prevObjects.Equipment && prevObjects.Equipment.EquipId) !== currentObjects.Equipment;
    }

    isFunctionalLocationNotEqual(prevObjects, currentObjects) {
        return (prevObjects.FunctionalLocation && prevObjects.FunctionalLocation.FuncLocIdIntern) !== decodeURIComponent(currentObjects.FunctionalLocation);
    }

    updateConfirmation(context) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationUpdate.action',
            'Properties': {
                'Properties': this._confirmation.headerData,
            },
        }).then((response) => {
            let link = JSON.parse(response.data)['@odata.readLink'];
            this.setConfirmationLink(link);

            let actions = [];
            let currentObjects = this._confirmation.relatedObjectsData;
            let prevObjects = this._confirmation.prevRelatedObjectsData;
            const isProductValid = this.isProductNotEqual(prevObjects, currentObjects);
            const isEquipmentNotEqual = this.isEquipmentNotEqual(prevObjects, currentObjects);
            const isFunctionalLocationEqual = this.isFunctionalLocationNotEqual(prevObjects, currentObjects);

            if (isProductValid) {
                if (currentObjects.Product) {
                    actions.push(this.createProduct(context, currentObjects.Product, link));
                }

                if (prevObjects.Material) {
                    actions.push(this.deleteRelatedObject(context, prevObjects.MaterialObject['@odata.readLink']));
                }
            }

            if (isFunctionalLocationEqual) {
                if (currentObjects.FunctionalLocation) {
                    actions.push(this.createFLOC(context, currentObjects.FunctionalLocation, link));
                }

                if (prevObjects.FunctionalLocation) {
                    actions.push(this.deleteRelatedObject(context, prevObjects.FunctionalLocationObject['@odata.readLink']));
                }
            }

            if (isEquipmentNotEqual) {
                if (currentObjects.Equipment) {
                    actions.push(this.createEquipment(context, currentObjects.Equipment, link));
                }

                if (prevObjects.Equipment) {
                    actions.push(this.deleteRelatedObject(context, prevObjects.EquipmentObject['@odata.readLink']));
                }
            }


            return Promise.all(actions);
        });
    }

    deleteRelatedObject(context, link) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericDiscard.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'S4ServiceConfirmationRefObjs',
                    'EditLink': link,
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                },
            },
        });
    }

    setConfirmationOpenStatus(context) {
        return GetServiceConfirmationLocalID(context).then(id => {
            let type = GetConfirmationObjectType(context);
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusServiceConfirmationSetOpen.action',
                'Properties': {
                    'CreateLinks': [
                        {
                            'Property': 'OverallStatusCfg_Nav',
                            'Target': {
                                'EntitySet': 'EAMOverallStatusConfigs',
                                'QueryOptions': '/SAPAssetManager/Rules/MobileStatus/ServiceConfirmationItemOverallStatusConfigQueryOptions.js',
                            },
                        },
                        {
                            'Property': 'S4ServiceConfirmation_Nav',
                            'Target': {
                                'EntitySet': 'S4ServiceConfirmations',
                                'ReadLink': `S4ServiceConfirmations(ObjectID='${id}',ObjectType='${type}')`,
                            },
                        },
                    ],
                },
            });
        });
    }

    setConfirmationItemOpenStatus(context) {
        return GetServiceConfirmationLocalID(context).then(id => {
            return GetServiceConfirmationItemLocalID(context).then(itemNo => {
                let type = GetConfirmationObjectType(context);
                let itemLink = `S4ServiceConfirmationItems(ItemNo='${itemNo}',ObjectID='${id}',ObjectType='${type}')`;

                return context.read('/SAPAssetManager/Services/AssetManager.service', itemLink, ['ItemObjectType'], '').then(item => {
                    return context.executeAction({
                        'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusServiceConfirmationSetOpen.action',
                        'Properties': {
                            'Properties': {
                                'ObjectKey': '/SAPAssetManager/Rules/MobileStatus/MobileStatusSetReceivedObjectKeyToItem.js',
                                'ObjectType': '/SAPAssetManager/Globals/S4Service/ConfirmationItemMobileStatusObjectType.global',
                                'S4ItemNum': itemNo,
                                'BusinessObjectType': item.getItem(0).ItemObjectType,
                            },
                            'CreateLinks': [
                                {
                                    'Property': 'OverallStatusCfg_Nav',
                                    'Target': {
                                        'EntitySet': 'EAMOverallStatusConfigs',
                                        'QueryOptions': '/SAPAssetManager/Rules/MobileStatus/ServiceConfirmationItemOverallStatusConfigQueryOptions.js',
                                    },
                                },
                                {
                                    'Property': 'S4ServiceConfirmationItem_Nav',
                                    'Target': {
                                        'EntitySet': 'S4ServiceConfirmationItems',
                                        'ReadLink': itemLink,
                                    },
                                },
                            ],
                        },
                    });
                });
            });
        });
    }
}

ServiceConfirmationLibrary.confirmFlow = 'confirm';
ServiceConfirmationLibrary.holdFlow = 'hold';

ServiceConfirmationLibrary.confirmationsFlag = 'Confirmations';
ServiceConfirmationLibrary.confirmationFlag = 'Confirmation';
ServiceConfirmationLibrary.itemFlag = 'Item';
ServiceConfirmationLibrary.itemHocFlag = 'AdHocItem';
ServiceConfirmationLibrary.itemsFlag = 'Items';
