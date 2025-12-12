import ComLib from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import ValidationLibrary from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import NotificationUpdateSuccess from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationUpdateSuccess';
import GenerateNotificationID from '../../../../SAPAssetManager/Rules/Notifications/GenerateNotificationID';
import NotificationLibrary from '../NotificationLibrary';
import BreakdownSwitchValue from '../../../../SAPAssetManager/Rules/Notifications/BreakdownSwitchValue';
import NotificationCreateUpdateProcessingContextLstPkrValue from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateProcessingContextLstPkrValue';
import NotificationCreateUpdateQMCodeGroupValue from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateQMCodeGroupValue';
import NotificationCreateUpdateQMCodeValue from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateQMCodeValue';
import NotificationCreateUpdateCatalogValue from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateCatalogValue';
import NotificationCreateSuccess from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateSuccess';
import GetMalfunctionStartDate from '../../../../SAPAssetManager/Rules/Notifications/MalfunctionStartDate';
import GetMalfunctionStartTime from '../../../../SAPAssetManager/Rules/Notifications/MalfunctionStartTime';
import GetMalfunctionEndDate from '../../../../SAPAssetManager/Rules/Notifications/MalfunctionEndDate';
import GetMalfunctionEndTime from '../../../../SAPAssetManager/Rules/Notifications/MalfunctionEndTime';
import GetCurrentDate from '../../../../SAPAssetManager/Rules/Confirmations/BlankFinal/GetCurrentDate';
import NotificationReferenceNumber from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationReferenceNumber';
import NotificationReferenceType from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationReferenceType';
import { isControlPopulated } from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/RequiredFields';
import CreateEMPEntries from '../../../../SAPAssetManager/Rules/Notifications/EMP/CreateEMPEntries';
import IsFromOnlineFlocCreate from '../../../../SAPAssetManager/Rules/Common/IsFromOnlineFlocCreate';
import AnalyticsManager from '../../../../SAPAssetManager/Rules/AnalyticsManager/AnalyticsManagerLibrary';
import GenerateLocalID from '../../../../SAPAssetManager/Rules/Common/GenerateLocalID';

export default function NotificationCreateUpdateOnCommit(clientAPI) {

    //Temporary Workaround for an issue where the hierarchy list picker is wiping out the binding on the page. MDK issue logged MDKBUG-585.
    //Get the binding from the formcellcontainer

    let formCellContainer = clientAPI.getControl('FormCellContainer');
    if (ValidationLibrary.evalIsEmpty(clientAPI.binding)) {
        clientAPI._context.binding = formCellContainer.binding;
    }

    // Prevent double-pressing done button
    clientAPI.showActivityIndicator('');

    //Determine if we are on edit vs. create
    let onCreate = ComLib.IsOnCreate(clientAPI);
    let type = ComLib.getListPickerValue(clientAPI.getControls()[0].getControl('TypeLstPkr').getValue());
    ComLib.setStateVariable(clientAPI, 'NotificationType', type); // Saving type to later use for EAMOverallStatusConfigs
    let descr = clientAPI.getControls()[0].getControl('NotificationDescription').getValue();
    let plannerGroup = clientAPI.getControls()[0].getControl('PlannerGroupListPicker').getValue();
    let notifCategoryPromise = NotificationLibrary.getNotificationCategory(clientAPI, type).then(notifCategory => {
        ComLib.setStateVariable(clientAPI, 'NotificationCategory', notifCategory);
        return notifCategory;
    });
    if (onCreate) {
        // If we're creating a Notification, we will always be doing a ChangeSet
        ComLib.setStateVariable(clientAPI, 'ObjectCreatedName', 'Notification');
        if (!ValidationLibrary.evalIsEmpty(type) && !ValidationLibrary.evalIsEmpty(descr)) {
            let promises = [];
            promises.push(GenerateNotificationID(clientAPI));
            //DSB Customization
            //promises.push(NotificationLibrary.NotificationCreateMainWorkCenter(clientAPI));

            if (clientAPI.binding.OnlineEquipment) {
                const onlineEquip = ComLib.getControlProxy(clientAPI, 'OnlineEquipControl').getValue();
                promises.push(Promise.resolve(''));
                promises.push(Promise.resolve(onlineEquip ? onlineEquip.split(' - ')[0] : ''));
            } else if (IsFromOnlineFlocCreate(clientAPI)) {
                promises.push(clientAPI.binding.HeaderFunctionLocation);
                promises.push('');
            } else {
                promises.push(NotificationLibrary.NotificationCreateUpdateFunctionalLocationLstPkrValue(clientAPI));
                promises.push(NotificationLibrary.NotificationCreateUpdateEquipmentLstPkrValue(clientAPI));
            }
            promises.push(NotificationReferenceType(clientAPI));
            promises.push(notifCategoryPromise);
            promises.push(NotificationCreateUpdateProcessingContextLstPkrValue(clientAPI));
            return Promise.all(promises).then(results => {
                // eslint-disable-next-line no-unused-vars
                let [notifNum, floc, equip, refObjectType, notifCategory, npc] = results;

                let notificationCreateProperties = {
                    'PlanningGroup': plannerGroup.length ? plannerGroup[0].ReturnValue : '',
                    'PlanningPlant': ComLib.getUserDefaultPlanningPlant() || ComLib.getNotificationPlanningPlant(clientAPI),
                    'NotificationNumber': notifNum,
                    'NotificationDescription': descr,
                    'NotificationType': type,
                    'Priority': NotificationLibrary.NotificationCreateUpdatePrioritySegValue(clientAPI),
                    'HeaderFunctionLocation': floc,
                    'HeaderEquipment': equip,
                    'BreakdownIndicator': BreakdownSwitchValue(clientAPI),
                    //'MainWorkCenter': workcenter,                                                                         //DSB Customization
                    //'MainWorkCenterPlant': NotificationLibrary.NotificationCreateMainWorkCenterPlant(clientAPI),          //DSB Customization
                    'ReportedBy': ComLib.getSapUserName(clientAPI),
                    'CreationDate': GetCurrentDate(clientAPI),
                    'ReferenceNumber': NotificationReferenceNumber(clientAPI),
                    'RefObjectKey': NotificationReferenceNumber(clientAPI),
                    'RefObjectType': refObjectType,
                };

                //DSB customization - dont use QMCodeGroup
                //notificationCreateProperties.QMCodeGroup = NotificationCreateUpdateQMCodeGroupValue(clientAPI);
                //notificationCreateProperties.QMCode = NotificationCreateUpdateQMCodeValue(clientAPI);
                //notificationCreateProperties.QMCatalog = NotificationCreateUpdateCatalogValue(clientAPI);
                //* End of DSB customization

                // Only send Notification Processing Context if it's set to '01' or '02'
                if (npc !== '00') {
                    notificationCreateProperties.NotifProcessingContext = npc;
                }

                notificationCreateProperties = setMalfunctionDateTime(clientAPI, notificationCreateProperties);

                //Update property InspectionLot.
                if (clientAPI.binding && clientAPI.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                    notificationCreateProperties.InspectionLot = clientAPI.binding.InspectionLot;
                }

                return clientAPI.executeAction({
                    'Name': '/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationCreate.action',
                    'Properties': {
                        'Properties': notificationCreateProperties,
                        'Headers':
                        {
                            'OfflineOData.RemoveAfterUpload': 'true',
                            'OfflineOData.TransactionID': notifNum,
                        },
                    },
                }).then(actionResult => {
                    // Store created notification
                    ComLib.setStateVariable(clientAPI, 'CreateNotification', JSON.parse(actionResult.data));
                    return NotificationCreateSuccess(clientAPI, JSON.parse(actionResult.data)).then(() => {
                        AnalyticsManager.notificationCreateSuccess();
                    });
                }).then(() => {
                    if (!ComLib.isOnChangeset(clientAPI)) {
                        return CreateEMPEntries(clientAPI, clientAPI.getClientData().EMP).catch((error) => {
                            Logger.error('CreateEMPEntries error: ' + error);
                            /*clientAPI.dismissActivityIndicator();
                            return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');*/
                            return Promise.resolve(); // DSBtemp fix for mdk25
                        });
                    } else {
                        return Promise.resolve();
                    }
                }).catch(() => {
                    clientAPI.dismissActivityIndicator();
                    return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
                });
            }).catch(err => {
                Logger.error('Notification', err);
                clientAPI.dismissActivityIndicator();
                return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
            });

        } else {
            clientAPI.dismissActivityIndicator();
            Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), 'One of the required controls did not return a value OnCreate');
            return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
        }
    } else {
        let promises = [];
        //promises.push(NotificationLibrary.NotificationCreateMainWorkCenter(clientAPI));
        promises.push(notifCategoryPromise);

        return Promise.all(promises).then(results => {
            //let workcenter = results.length >= 2 ? results[0] : '';

            let notificationUpdateProperties = {
                'NotificationDescription': descr,
                'NotificationType': type,
                'Priority': NotificationLibrary.NotificationCreateUpdatePrioritySegValue(clientAPI),
                'HeaderFunctionLocation': NotificationLibrary.NotificationCreateUpdateFunctionalLocationLstPkrValue(clientAPI),
                'HeaderEquipment': NotificationLibrary.NotificationCreateUpdateEquipmentLstPkrValue(clientAPI),
                'BreakdownIndicator': BreakdownSwitchValue(clientAPI),
                //'PlanningGroup': plannerGroup.length ? plannerGroup[0].ReturnValue : '',                          //DSB Customization
                //'MainWorkCenter': workcenter,                                                                     //DSB Customization
                //'MainWorkCenterPlant': NotificationLibrary.NotificationCreateMainWorkCenterPlant(clientAPI),      //DSB Customization
            };

            notificationUpdateProperties = setMalfunctionDateTime(clientAPI, notificationUpdateProperties);

            notificationUpdateProperties.QMCodeGroup = NotificationCreateUpdateQMCodeGroupValue(clientAPI);
            notificationUpdateProperties.QMCode = NotificationCreateUpdateQMCodeValue(clientAPI);
            notificationUpdateProperties.QMCatalog = NotificationCreateUpdateCatalogValue(clientAPI);
            return clientAPI.executeAction({
                'Name': '/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationUpdate.action',
                'Properties': {
                    'Properties': notificationUpdateProperties,
                    'OnSuccess': '',
                },
            }).then(async (result) => {
                let data = JSON.parse(result.data);
                if (type !== '31') {   //DSB customization to disable Disable Object part/defect/cause - code and code group
                    let createItem = isControlPopulated('ItemDescription', formCellContainer) || [['PartGroupLstPkr', 'PartDetailsLstPkr'], ['DamageGroupLstPkr', 'DamageDetailsLstPkr']]
                        .some(([parentName, childName]) => isControlPopulated(parentName, formCellContainer) && isControlPopulated(childName, formCellContainer));

                    // DSb Coustomization for checking the Item is avaible or not 
                    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', data['@odata.readLink'] + '/Items', [], '').then(itemResult => {
                        if (itemResult.length > 0) {
                            let link = "MyNotificationItems(ItemNumber='0001',NotificationNumber='" + data.NotificationNumber + "')";
                            return clientAPI.executeAction({
                                'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemUpdate.action',
                                'Properties': {
                                    'Properties': {
                                        'ItemText': clientAPI.evaluateTargetPath('#Control:ItemDescription/#Value'),
                                        'ObjectPartCodeGroup': itemResult.getItem(0).ObjectPartCodeGroup,
                                        'ObjectPart': itemResult.getItem(0).ObjectPart,
                                        'CodeGroup': itemResult.getItem(0).CodeGroup,
                                        'DamageCode': itemResult.getItem(0).DamageCode
                                    },

                                    'Headers': {
                                        'OfflineOData.TransactionID': data.NotificationNumber,
                                    },
                                    "Target": {
                                        "EntitySet": "MyNotificationItems",
                                        "Service": "/SAPAssetManager/Services/AssetManager.service",
                                        "ReadLink": link,
                                    },
                                    'OnSuccess': '',
                                },

                            });

                        } else {
                            let localItemNum = GenerateLocalID(clientAPI, `${data['@odata.readLink']}/Items`, 'ItemNumber', '0000', '', '');
                            let sortNum = GenerateLocalID(clientAPI, `${data['@odata.readLink']}/Items`, 'ItemSortNumber', '0000', '', '');
                            return Promise.all([localItemNum, sortNum]).then(function (promises) {
                                let notificationItemCreateAction = '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCreate.action';
                                return clientAPI.executeAction({
                                    'Name': notificationItemCreateAction, 'Properties': {
                                        'Properties':
                                        {
                                            'NotificationNumber': data.NotificationNumber,
                                            'ItemNumber': promises[0],
                                            'ItemText': clientAPI.evaluateTargetPath('#Control:ItemDescription/#Value'),
                                            "ObjectPartCodeGroup": '',
                                            "ObjectPart": '',
                                            "CodeGroup": '',
                                            "DamageCode": '',
                                            'ItemSortNumber': promises[1],
                                        },
                                        'Headers':
                                        {
                                            'OfflineOData.RemoveAfterUpload': 'true',
                                            'OfflineOData.TransactionID': data.NotificationNumber,
                                        },
                                        'CreateLinks':
                                            [{
                                                'Property': 'Notification',
                                                'Target':
                                                {
                                                    'EntitySet': 'MyNotificationHeaders',
                                                    'ReadLink': data['@odata.readLink'],
                                                },
                                            }],
                                        'OnSuccess': '',
                                        'OnFailure': '',
                                    }
                                });

                            });
                        }

                    });
                    // else {
                    //     return Promise.reject(); // Skip item and cause create
                    // }
                }
                else {
                    //DSB  
                    return Promise.reject({ 'skip': true }); // Skip item and cause create
                }
            }).then(actionResult => {
                // eslint-disable-next-line brace-style
                // eslint-disable-next-line brace-style

                let createCause = !!(function () {
                    try {
                        return clientAPI.evaluateTargetPath('#Control:CauseDescription/#Value');
                    } catch (exc) {
                        return '';
                    }
                })();

                if (createCause) {
                    let data = JSON.parse(actionResult.data);
                    let causeSequenceNumber = "";
                    return ComLib.getEntitySetCount(clientAPI, data['@odata.readLink'] + '/ItemCauses').then(count => {
                        Logger.error("Item count", count);
                        if (count < 1) {
                            return clientAPI.executeAction({
                                'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseCreate.action',
                                'Properties': {
                                    'Properties': {
                                        'NotificationNumber': data.NotificationNumber,
                                        'ItemNumber': data.ItemNumber,
                                        'CauseSequenceNumber': '0001',
                                        'CauseText': clientAPI.evaluateTargetPath('#Control:CauseDescription/#Value'),
                                        // eslint-disable-next-line brace-style
                                        'CauseCodeGroup': (function () {
                                            try {
                                                return clientAPI.evaluateTargetPath('#Control:CauseGroupLstPkr/#SelectedValue');
                                            } catch (e) {
                                                return '';
                                            }
                                        })(),
                                        // eslint-disable-next-line brace-style
                                        'CauseCode': (function () {
                                            try {
                                                return clientAPI.evaluateTargetPath('#Control:CodeLstPkr/#SelectedValue');
                                            } catch (e) {
                                                return '';
                                            }
                                        })(),
                                        'CauseSortNumber': '0001',
                                    },
                                    'Headers': {
                                        'OfflineOData.RemoveAfterUpload': 'true',
                                        'OfflineOData.TransactionID': data.NotificationNumber,
                                    },
                                    'CreateLinks': [{
                                        'Property': 'Item',
                                        'Target': {
                                            'EntitySet': 'MyNotificationItems',
                                            'ReadLink': data['@odata.readLink'],
                                        },
                                    }],
                                    'OnSuccess': '',
                                },
                            });

                        } else {
                            let linksURL = "MyNotificationItemCauses(ItemNumber='" + data.ItemNumber + "',NotificationNumber='" + data.NotificationNumber + "',CauseSequenceNumber='0001')";
                            return clientAPI.executeAction({
                                'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseUpdate.action',
                                'Properties': {
                                    'Properties': {
                                        'CauseText': clientAPI.evaluateTargetPath('#Control:CauseDescription/#Value'),
                                        // eslint-disable-next-line brace-style
                                        'CauseCodeGroup': (function () {
                                            try {
                                                return clientAPI.evaluateTargetPath('#Control:CauseGroupLstPkr/#SelectedValue');
                                            } catch (e) {
                                                return '';
                                            }
                                        })(),
                                        // eslint-disable-next-line brace-style
                                        'CauseCode': (function () {
                                            try {
                                                return clientAPI.evaluateTargetPath('#Control:CodeLstPkr/#SelectedValue');
                                            } catch (e) {
                                                return '';
                                            }
                                        })(),
                                        // 'CauseSortNumber': '0001',
                                    },
                                    'Headers': {
                                        'OfflineOData.TransactionID': data.NotificationNumber,
                                    },
                                    "Target": {
                                        "EntitySet": "MyNotificationItemCauses",
                                        "Service": "/SAPAssetManager/Services/AssetManager.service",
                                        "ReadLink": linksURL,
                                    },
                                },
                                'OnSuccess': '',
                            });
                        }
                    });

                } else {
                    return Promise.reject(); // Skip cause create
                }
            }).catch(() => {
                return Promise.resolve(); // Continue action chain
            }).then(() => {
                return CreateEMPEntries(clientAPI, clientAPI.getClientData().EMP).catch((error) => {
                    Logger.error('CreateEMPEntries error: ' + error);
                    /*clientAPI.dismissActivityIndicator();
                    return clientAPI.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');*/
                    return Promise.resolve(); // Continue action chain. DSB Temp fix for mdk25
                });
            }).catch(() => {
                return Promise.resolve(); // Continue action chain
            }).then(() => {
                return NotificationUpdateSuccess(clientAPI);
            });
        }).catch(() => {
            clientAPI.dismissActivityIndicator();
            return clientAPI.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
        });
    }
}

function setMalfunctionDateTime(clientAPI, properties) {
    properties.MalfunctionStartDate = GetMalfunctionStartDate(clientAPI);
    properties.MalfunctionStartTime = GetMalfunctionStartTime(clientAPI);

    properties.MalfunctionEndDate = GetMalfunctionEndDate(clientAPI);
    properties.MalfunctionEndTime = GetMalfunctionEndTime(clientAPI);

    return properties;
}
