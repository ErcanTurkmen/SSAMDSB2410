import CommonLibrary from '../../Common/Library/CommonLibrary';
import DocumentLibrary from '../../Documents/DocumentLibrary';
import Logger from '../../Log/Logger';
import S4ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';
import AnalyticsManager from '../../AnalyticsManager/AnalyticsManagerLibrary';

export default function ServiceRequestCreateUpdateOnCommit(context) {
    if (CommonLibrary.IsOnCreate(context)) {
        CommonLibrary.setStateVariable(context, 'LocalId', '');
        return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/CreateUpdate/ServiceRequestCreate.action')
            .then(response => {
                CommonLibrary.setStateVariable(context, 'CreateFunctionalLocation', JSON.parse(response.data));
                context.getClientData().LocalLink = JSON.parse(response.data)['@odata.readLink'];

                return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/CreateUpdate/ServiceRequestPartnerCreate.action').then(() => {
                    return _createNote(context).then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                            return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceRequestCreateSuccessMessage.action').then(() => {
                                AnalyticsManager.serviceRequestCreateSuccess();
                            });
                        });
                    });
                });
            }).catch((error)=>{
                Logger.error('Create Service Request', error);
                return context.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
            });
    } else {
        return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/CreateUpdate/ServiceRequestUpdate.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceRequestUpdateSuccessMessage.action');
            });
        });
    }
}

function _createNote(context) {
    return _createProduct(context).then(() => {
        let note = CommonLibrary.getControlProxy(context, 'LongTextNote').getValue();
        if (note) {
            return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceRequestNoteCreate.action');
        } else {
            return Promise.resolve();
        }
    });
}

function _createProduct(context) {
    return _createServiceRequestFloc(context).then(() => {
        let product = CommonLibrary.getTargetPathValue(context, '#Page:ServiceRequestCreateUpdatePage/#Control:ProductLstPkr/#SelectedValue');
        if (product) {
            return context.executeAction('/SAPAssetManager/Actions/ReferenceObjects/RefObjectCreateDuringSRCreate.action');
        } else {
            return Promise.resolve();
        }
    });
}

function _createServiceRequestFloc(context) {
    return _createServiceRequestEquipment(context).then(() => {
        let floc = S4ServiceRequestControlsLibrary.getFunctionalLocationValue(context);
        if (floc) {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/ReferenceObjects/RefObjectCreateDuringSRCreate.action',
                'Properties': {
                    'Properties': {
                        'ProductID': '',
                        'FLocID': floc,
                    },
                    'CreateLinks': [
                        {
                            'Property': 'S4ServiceRequest_Nav',
                            'Target': {
                                'EntitySet': 'S4ServiceRequests',
                                'ReadLink': 'pending_1',
                            },
                        },
                        {
                            'Property': 'MyFunctionalLocation_Nav',
                            'Target': {
                                'EntitySet': 'MyFunctionalLocations',
                                'ReadLink': `MyFunctionalLocations('${floc}')`,
                            },
                        },
                    ],
                },
            });
        } else {
            return Promise.resolve();
        }
    });
}

function _createServiceRequestEquipment(context) {
    return _createDocuments(context).then(() => {
        let equipment = S4ServiceRequestControlsLibrary.getEquipmentValue(context);
        if (equipment) {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/ReferenceObjects/RefObjectCreateDuringSRCreate.action',
                'Properties': {
                    'Properties': {
                        'ProductID': '',
                        'EquipID': equipment,
                    },
                    'CreateLinks': [
                        {
                            'Property': 'S4ServiceRequest_Nav',
                            'Target': {
                                'EntitySet': 'S4ServiceRequests',
                                'ReadLink': 'pending_1',
                            },
                        },
                        {
                            'Property': 'MyEquipment_Nav',
                            'Target': {
                                'EntitySet': 'MyEquipments',
                                'ReadLink': `MyEquipments('${equipment}')`,
                            },
                        },
                    ],
                },
            });
        } else {
            return Promise.resolve();
        }
    });
}

function _createDocuments(context) {
    let attachmentDescription = CommonLibrary.getControlProxy(context, 'AttachmentDescription').getValue() || '';
    let attachments = CommonLibrary.getControlProxy(context, 'Attachment').getValue();

    CommonLibrary.setStateVariable(context, 'DocDescription', attachmentDescription);
    CommonLibrary.setStateVariable(context, 'Doc', attachments);
    CommonLibrary.setStateVariable(context, 'Class', 'ServiceRequest');
    CommonLibrary.setStateVariable(context, 'ObjectKey', 'ObjectID');
    CommonLibrary.setStateVariable(context, 'entitySet', 'S4ServiceRequestDocuments');
    CommonLibrary.setStateVariable(context, 'parentEntitySet', 'S4ServiceRequests');
    CommonLibrary.setStateVariable(context, 'parentProperty', 'S4ServiceRequest_Nav');
    CommonLibrary.setStateVariable(context, 'attachmentCount', DocumentLibrary.validationAttachmentCount(context));

    return Promise.resolve();
}

function checkRefObj(refObj, equipValue, flocValue, productValue) {
    return (!equipValue && refObj.EquipID) || (!flocValue && refObj.FLocID) || (!productValue && refObj.ProductID);
}


export function updateRefObjects(context, binding) {
    const equipValue = S4ServiceRequestControlsLibrary.getEquipmentValue(context) || null;
    const flocValue = S4ServiceRequestControlsLibrary.getFunctionalLocationValue(context) || null;
    const productValue = CommonLibrary.getTargetPathValue(context, '#Page:ServiceRequestCreateUpdatePage/#Control:ProductLstPkr/#SelectedValue') || null;

    return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/RefObj_Nav`, [], '').then(results => {
        let refObjectDeleteAction = Promise.resolve();
        let refObj = {};

        if (results && results.length > 0) {
            refObj = results.getItem(0);

            const isRefObjFilled = checkRefObj(refObj, equipValue, flocValue, productValue);

            if (isRefObjFilled) {
                refObjectDeleteAction = context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action',
                    'Properties': {
                        'Target': {
                            'EntitySet': 'S4ServiceRequestRefObjs',
                            'ReadLink': refObj['@odata.readLink'],
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                        },
                    },
                });
            }
        }

        return refObjectDeleteAction.then(() => {
            let refObjectCreateAction = Promise.resolve();

            if (productValue && !refObj.ProductID) {
                refObjectCreateAction = context.executeAction({
                    'Name': '/SAPAssetManager/Actions/ReferenceObjects/RefObjectCreateDuringSRCreate.action',
                    'Properties': {
                        'Properties': {
                            'ProductID': productValue,
                        },
                        'CreateLinks': [
                            {
                                'Property': 'S4ServiceRequest_Nav',
                                'Target': {
                                    'EntitySet': 'S4ServiceRequests',
                                    'ReadLink': binding['@odata.readLink'],
                                },
                            },
                            {
                                'Property': 'Material_Nav',
                                'Target': {
                                    'EntitySet': 'Materials',
                                    'ReadLink': `Materials('${productValue}')`,
                                },
                            },
                        ],
                    },
                });
            } else if (flocValue && !refObj.FLocID) {
                refObjectCreateAction = context.executeAction({
                    'Name': '/SAPAssetManager/Actions/ReferenceObjects/RefObjectCreateDuringSRCreate.action',
                    'Properties': {
                        'Properties': {
                            'FLocID': flocValue,
                        },
                        'CreateLinks': [
                            {
                                'Property': 'S4ServiceRequest_Nav',
                                'Target': {
                                    'EntitySet': 'S4ServiceRequests',
                                    'ReadLink': binding['@odata.readLink'],
                                },
                            },
                            {
                                'Property': 'MyFunctionalLocation_Nav',
                                'Target': {
                                    'EntitySet': 'MyFunctionalLocations',
                                    'ReadLink': `MyFunctionalLocations('${flocValue}')`,
                                },
                            },
                        ],
                    },
                });
            } else if (equipValue && !refObj.EquipID) {
                refObjectCreateAction = context.executeAction({
                    'Name': '/SAPAssetManager/Actions/ReferenceObjects/RefObjectCreateDuringSRCreate.action',
                    'Properties': {
                        'Properties': {
                            'EquipID': equipValue,
                        },
                        'CreateLinks': [
                            {
                                'Property': 'S4ServiceRequest_Nav',
                                'Target': {
                                    'EntitySet': 'S4ServiceRequests',
                                    'ReadLink': binding['@odata.readLink'],
                                },
                            },
                            {
                                'Property': 'MyEquipment_Nav',
                                'Target': {
                                    'EntitySet': 'MyEquipments',
                                    'ReadLink': `MyEquipments('${equipValue}')`,
                                },
                            },
                        ],
                    },
                });
            } else if (refObj['@odata.readLink'] && (productValue !== refObj.ProductID || flocValue !== refObj.FLocID || equipValue !== refObj.EquipID)) {
                context.binding.refObjectReadLink = refObj['@odata.readLink'];
                refObjectCreateAction = context.executeAction('/SAPAssetManager/Actions/ReferenceObjects/ServiceRequestRefObjectUpdate.action');
            }

            return refObjectCreateAction;
        });
    });
}
