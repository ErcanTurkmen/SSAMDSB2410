import ComLib from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';
import NotificationUpdateSuccess from '../CreateUpdate/NotificationUpdateSuccess';
import GenerateNotificationID from '../GenerateNotificationID';
import NotificationLibrary from '../NotificationLibrary';
import BreakdownSwitchValue from '../BreakdownSwitchValue';
import NotificationCreateUpdateProcessingContextLstPkrValue from './NotificationCreateUpdateProcessingContextLstPkrValue';
import NotificationCreateUpdateQMCodeGroupValue from './NotificationCreateUpdateQMCodeGroupValue';
import NotificationCreateUpdateQMCodeValue from './NotificationCreateUpdateQMCodeValue';
import NotificationCreateUpdateCatalogValue from './NotificationCreateUpdateCatalogValue';
import NotificationCreateSuccess from './NotificationCreateSuccess';
import GetMalfunctionStartDate from '../MalfunctionStartDate';
import GetMalfunctionStartTime from '../MalfunctionStartTime';
import GetMalfunctionEndDate from '../MalfunctionEndDate';
import GetMalfunctionEndTime from '../MalfunctionEndTime';
import GetCurrentDate from '../../Confirmations/BlankFinal/GetCurrentDate';
import NotificationReferenceNumber from './NotificationReferenceNumber';
import NotificationReferenceType from './NotificationReferenceType';
import { isControlPopulated } from './RequiredFields';
import CreateEMPEntries from '../EMP/CreateEMPEntries';
import IsFromOnlineFlocCreate from '../../Common/IsFromOnlineFlocCreate';
import AnalyticsManager from '../../AnalyticsManager/AnalyticsManagerLibrary';

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
            promises.push(NotificationLibrary.NotificationCreateMainWorkCenter(clientAPI));

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
                let [notifNum, workcenter, floc, equip, refObjectType, notifCategory, npc] = results;

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
                    'MainWorkCenter': workcenter,
                    'MainWorkCenterPlant': NotificationLibrary.NotificationCreateMainWorkCenterPlant(clientAPI),
                    'ReportedBy': ComLib.getSapUserName(clientAPI),
                    'CreationDate': GetCurrentDate(clientAPI),
                    'ReferenceNumber': NotificationReferenceNumber(clientAPI),
                    'RefObjectKey': NotificationReferenceNumber(clientAPI),
                    'RefObjectType': refObjectType,
                };

                notificationCreateProperties.QMCodeGroup = NotificationCreateUpdateQMCodeGroupValue(clientAPI);
                notificationCreateProperties.QMCode = NotificationCreateUpdateQMCodeValue(clientAPI);
                notificationCreateProperties.QMCatalog = NotificationCreateUpdateCatalogValue(clientAPI);

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
                            clientAPI.dismissActivityIndicator();
                            return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
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
        promises.push(NotificationLibrary.NotificationCreateMainWorkCenter(clientAPI));
        promises.push(notifCategoryPromise);

        return Promise.all(promises).then(results => {
            let workcenter = results.length >= 2 ? results[0] : '';

            let notificationUpdateProperties = {
                'NotificationDescription': descr,
                'NotificationType': type,
                'Priority': NotificationLibrary.NotificationCreateUpdatePrioritySegValue(clientAPI),
                'HeaderFunctionLocation': NotificationLibrary.NotificationCreateUpdateFunctionalLocationLstPkrValue(clientAPI),
                'HeaderEquipment': NotificationLibrary.NotificationCreateUpdateEquipmentLstPkrValue(clientAPI),
                'BreakdownIndicator': BreakdownSwitchValue(clientAPI),
                'PlanningGroup': plannerGroup.length ? plannerGroup[0].ReturnValue : '',
                'MainWorkCenter': workcenter,
                'MainWorkCenterPlant': NotificationLibrary.NotificationCreateMainWorkCenterPlant(clientAPI),
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
            }).then(() => {
                const createItem = isControlPopulated('ItemDescription', formCellContainer) || [['PartGroupLstPkr', 'PartDetailsLstPkr'], ['DamageGroupLstPkr', 'DamageDetailsLstPkr']]
                    .some(([parentName, childName]) => isControlPopulated(parentName, formCellContainer) && isControlPopulated(childName, formCellContainer));
                if (createItem) {
                    return clientAPI.executeAction({
                        'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCreate.action',
                        'Properties': {
                            'OnSuccess': '',
                        },
                    });
                } else {
                    return Promise.reject(); // Skip item and cause create
                }
            }).then(actionResult => {
                // eslint-disable-next-line brace-style
                const createCause = isControlPopulated('CauseDescription', formCellContainer) || ['CodeLstPkr', 'CauseGroupLstPkr'].every(pickerName => isControlPopulated(pickerName, formCellContainer));
                if (createCause) {
                    let data = JSON.parse(actionResult.data);
                    return clientAPI.executeAction({
                        'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseCreate.action',
                        'Properties': {
                            'Properties':
                            {
                                'NotificationNumber': data.NotificationNumber,
                                'ItemNumber': data.ItemNumber,
                                'CauseSequenceNumber': '0001',
                                'CauseText': clientAPI.evaluateTargetPath('#Control:CauseDescription/#Value') || '',
                                // eslint-disable-next-line brace-style
                                'CauseCodeGroup': (function() { try { return clientAPI.evaluateTargetPath('#Control:CauseGroupLstPkr/#SelectedValue'); } catch (e) { return ''; } })(),
                                // eslint-disable-next-line brace-style
                                'CauseCode': (function() { try { return clientAPI.evaluateTargetPath('#Control:CodeLstPkr/#SelectedValue'); } catch (e) { return ''; } })(),
                                'CauseSortNumber': '0001',
                            },
                            'Headers':
                            {
                                'OfflineOData.RemoveAfterUpload': 'true',
                                'OfflineOData.TransactionID': data.NotificationNumber,
                            },
                            'CreateLinks':
                                [{
                                    'Property': 'Item',
                                    'Target':
                                    {
                                        'EntitySet': 'MyNotificationItems',
                                        'ReadLink': data['@odata.readLink'],
                                    },
                                }],
                            'OnSuccess': '',
                        },
                    });
                } else {
                    return Promise.reject(); // Skip cause create
                }
            }).then(() => {
                return CreateEMPEntries(clientAPI, clientAPI.getClientData().EMP).catch((error) => {
                    Logger.error('CreateEMPEntries error: ' + error);
                    clientAPI.dismissActivityIndicator();
                    return clientAPI.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
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
