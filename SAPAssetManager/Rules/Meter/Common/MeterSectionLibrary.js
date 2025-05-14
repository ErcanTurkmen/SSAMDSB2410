import IsAndroid from '../../Common/IsAndroid';
import IsIOS from '../../Common/IsIOS';
import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';
import libCommon from '../../Common/Library/CommonLibrary';
import libMeter from '../../Meter/Common/MeterLibrary';
import AllowMeterCreate from '../../WorkOrders/Meter/Details/AllowMeterCreate';
import IsUninstallMeterButtonEnabled from '../CreateUpdate/IsUninstallMeterAvailable';
import EDTSoftInputModeConfig from '../../Extensions/EDT/EDTSoftInputModeConfig';

export default class {

    /**
     * Getting ISO type constants
     * @param {IClientAPI} context
     */
    static getMeterISOConstants(context) {
        const INSTALL = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallMeterType.global').getValue();
        const REP_INST = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/ReplaceInstallMeterType.global').getValue();
        const REPLACE = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/ReplaceMeterType.global').getValue();
        const REMOVE = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveMeterType.global').getValue();
        const DISCONNECT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/DisconnectMeterType.global').getValue();
        const RECONNECT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/ReconnectMeterType.global').getValue();
        const REPAIR = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RepairMeterType.global').getValue();
        const READING = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/ReadingMeterType.global').getValue();
        const INSTALL_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallEditMeterType.global').getValue();
        const REMOVE_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveEditMeterType.global').getValue();
        const REPLACE_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/ReplaceEditMeterType.global').getValue();

        return {
            INSTALL,
            REP_INST,
            REPLACE,
            REMOVE,
            DISCONNECT,
            RECONNECT,
            INSTALL_EDIT,
            REMOVE_EDIT,
            REPAIR,
            READING,
            REPLACE_EDIT,
        };
    }

    /**
     * Getting current WO binding
     * @param {IClientAPI} context
     */
    static getWorkOrderBinding(context, replaceBinding) {
        let binding = replaceBinding || context.binding;
        switch (binding['@odata.type']) {
            case '#sap_mobile.MyWorkOrderOperation':
                binding = binding.WOHeader;
                break;
            case '#sap_mobile.MyWorkOrderSubOperation':
                binding = binding.WorkOrderOperation.WOHeader;
                break;
            case '#sap_mobile.DisconnectionObject':
                binding = binding.DisconnectActivity_Nav.WOHeader_Nav;
                break;
            case '#sap_mobile.OrderISULink':
                binding = binding.Workorder_Nav;
                break;
            default:
                break;

        }
        return binding;
    }

    /**
     * Getting current WO status for further actions
     * @param {IClientAPI} context
     */
    static async getWorkOrderISUProcessType(context, replaceBinding) {
        let binding = this.getWorkOrderBinding(context, replaceBinding);
        if (!binding?.OrderISULinks[0]?.ISUProcess) {
            binding = await this.getWorkOrderDetailedBindingObject(context, replaceBinding);
        }
        if (binding?.OrderISULinks[0]?.ISUProcess) {
            return binding?.OrderISULinks[0]?.ISUProcess;
        }
        return '';
    }

    /**
     * Getting current Meter status for further actions
     * @param {IClientAPI} context
     */
    static async getMeterISUProcessType(context, replaceBinding) {
        const { DISCONNECT, RECONNECT } = this.getMeterISOConstants(context);
        const binding = replaceBinding || context.binding;
        let meterTransactionType = binding.ISUProcess;
        if (!meterTransactionType && binding.DisconnectActivity_Nav) {
            meterTransactionType = await this.getWorkOrderISUProcessType(context, binding);
            if (
                (meterTransactionType !== DISCONNECT || binding.DisconnectActivity_Nav.ActivityStatus !== '10') &&
                (meterTransactionType !== RECONNECT || binding.DisconnectActivity_Nav.ActivityStatus !== '20')
            ) {
                return '';
            }
        }
        return meterTransactionType;
    }

    /**
     * Getting current WO binding object including all required fields
     * Using context.read() to clarify that we'll definitely receive all of them
     * @param {IClientAPI} context
     * @param {Object} replaceBinding
     */
    static async getWorkOrderDetailedBindingObject(context, replaceBinding, replaceExpand) {
        let woBinding;
        const binding = replaceBinding || context.binding;
        const expand = replaceExpand || '$expand=OrderISULinks,OrderMobileStatus_Nav';
        const service = '/SAPAssetManager/Services/AssetManager.service';
        if (binding && binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
            woBinding = await context.read(service, binding['@odata.readLink'] + '/WOHeader', [], expand).then(result => result.getItem(0));
        } else if (binding && binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
            woBinding = await context.read(service, binding['@odata.readLink'] + '/WorkOrderOperation/WOHeader', [], expand).then(result => result.getItem(0));
        } else if (binding && binding['@odata.type'] === '#sap_mobile.DisconnectionObject') {
            woBinding = await context.read(service, binding['@odata.readLink'] + '/DisconnectActivity_Nav/WOHeader_Nav', [], expand).then(result => result.getItem(0));
        } else if (binding && binding['@odata.type'] === '#sap_mobile.OrderISULink') {
            woBinding = await context.read(service, binding['@odata.readLink'] + '/Workorder_Nav', [], expand).then(result => result.getItem(0));
        }
    
        return woBinding || binding;
    }

    /**
     * Getting current isu link binding object including all required fields
     * Using context.read() to clarify that we'll definitely receive all of them
     * @param {IClientAPI} context
     */
     static async getOrderIsuLinkDetailedBindingObject(context) {
        let binding = context.binding;
        if (binding && binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
            binding = await context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], '$expand=OrderISULinks').then(result => result.getItem(0).OrderISULinks[0]);
        } else if (binding && binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
            binding = await context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/WOHeader', [], '$expand=OrderISULinks').then(result => result.getItem(0).OrderISULinks[0]);
        } else if (binding && binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
            binding = await context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/WorkOrderOperation/WOHeader', [], '$expand=OrderISULinks').then(result => result.getItem(0).OrderISULinks[0]);
        }
    
        return binding;
    }

    /**
     * Getting current status of meter availability
     * @param {IClientAPI} context
     */
    static isTechObjectStarted(context, woBinding) {
        let isStartedPromise = null;
    
        switch (libCommon.getWorkOrderAssnTypeLevel(context)) {
            case 'Header':
                // Header level: Check the OrderMobileStatus, and return the resolved Promise.
                isStartedPromise = Promise.resolve(woBinding.OrderMobileStatus_Nav.MobileStatus === 'STARTED' || woBinding.MobileStatus === 'STARTED');
                break;
            case 'Operation':
                // Operation Level: Get a count of all of the Operations whose OperationMobileStatus is 'STARTED'. If count > 0, return true.
                isStartedPromise = context.count('/SAPAssetManager/Services/AssetManager.service', woBinding['@odata.readLink'] + '/Operations', "$filter=OperationMobileStatus_Nav/MobileStatus eq 'STARTED'").then(count => {
                    return (count > 0);
                });
                break;
            case 'SubOperation':
                // Suboperation Level: Get a count of all of the Operations who have a Sub-Operation whose SuboperationMobileStatus is 'STARTED'. If count > 0, return true.
                isStartedPromise = context.count('/SAPAssetManager/Services/AssetManager.service', woBinding['@odata.readLink'] + '/Operations', "$filter=SubOperations/any(subop : subop/SubOpMobileStatus_Nav/MobileStatus eq 'STARTED'").then(count => {
                    return (count > 0);
                });
                break;
            default:
                isStartedPromise = Promise.resolve(false);
        }
    
        return isStartedPromise;
    }

     /**
     * Icons for left side of ObjectCell of Meter section:
     * Local icon - if Meter was changed locally
     * @param {IClientAPI} context
     */
     static getSectionLeftIcons(context) {
        const iconImage = [];
        if (libMeter.isLocal(context.binding)) {
            iconImage.push(
                IsAndroid(context) 
                    ? '/SAPAssetManager/Images/syncOnListIcon.android.png'
                    : '/SAPAssetManager/Images/syncOnListIcon.png',
            
            );
        }
        return iconImage;
    }

    /**
     * Setting value for AccessoryButtonText or AccessoryButtonIcon
     * depending on target platform and current WO type
     * @param {IClientAPI} context
     */
    static async getActionButtonOrIcon(context) {
        const property = context.getProperty();
        // IOS supports button text
        if (IsIOS(context) && property === 'AccessoryButtonText') {
            return await this.accessoryButtonTargetValues(context, 'Label');
        }
        // Android only supports icons for now
        if (IsAndroid(context) && property === 'AccessoryButtonIcon') {
            return await this.accessoryButtonTargetValues(context, 'Icon');
        }
        return '';
    }

     /**
     * action icon/button target values
     * based on target value returns required rule/icon/label
     * Icon returns only Android icon!
     * @param {IClientAPI} context
     * @param {String} targetVal = 'Icon' | 'Label' | 'Action'
     * @param {Object} replaceBinding
     */
    static async accessoryButtonTargetValues(context, targetVal, replaceBinding) {
        const binding = replaceBinding || context.binding;
        const woBinding = await this.getWorkOrderDetailedBindingObject(context, binding);
        const isStarted = await this.isTechObjectStarted(context, woBinding);
        const meterType = await this.getMeterISUProcessType(context, binding);
        const { 
            INSTALL,
            REP_INST,
            REPLACE,
            REMOVE,
            DISCONNECT,
            RECONNECT,
            REPAIR,
            READING,
        } = this.getMeterISOConstants(context);

        if (isStarted) {
            switch (meterType) {
                case INSTALL:
                case REP_INST:
                    return this.getInstallAccessoryTargetValues(context, binding, targetVal);
                case RECONNECT:
                    return this.getReconnectAccessoryTargetValues(context, binding, targetVal);
                case DISCONNECT:
                    return this.getDisconnectAccessoryTargetValues(context, binding, targetVal);
                case REPLACE:
                    return this.getReplaceAccessoryTargetValues(context, binding, targetVal);
                case REMOVE:
                    return this.getUninstallAccessoryTargetValues(context, binding, targetVal);
                case REPAIR: 
                    return this.getRepairAccessoryTargetValues(context, targetVal);
                case READING: 
                    return this.getReadingAccessoryTargetValues(context, binding, targetVal);
                default:
                    break;
            }
        }
        return '';
    }

    /**
     * get Install accessory target values based on Meter type
     * @param {IClientAPI} context
     * @param {Object} binding
     * @param {String} targetVal = 'Icon' | 'Label' | 'Action'
     */
    static getInstallAccessoryTargetValues(context, binding, targetVal) {
        if (libMeter.isLocal(binding) && libMeter.isProcessed(binding)) {
            return this.editAccValues(context, targetVal);
        }
        return '';
    }

    /**
     * get Uninstall accessory target values based on Meter type
     * @param {IClientAPI} context
     * @param {Object} binding
     * @param {String} targetVal = 'Icon' | 'Label' | 'Action'
     */
    static getUninstallAccessoryTargetValues(context, binding, targetVal) {
        if (libMeter.isLocal(binding) && libMeter.isProcessed(binding)) {
            return this.editAccValues(context, targetVal);
        } else if (!libMeter.isProcessed(binding)) {
            return this.uninstallAccValues(context, targetVal);
        }
        return '';
    }

    /**
     * get Replace accessory target values based on Meter type
     * @param {IClientAPI} context
     * @param {Object} binding
     * @param {String} targetVal = 'Icon' | 'Label' | 'Action'
     */
    static getReplaceAccessoryTargetValues(context, binding, targetVal) {
        if (libMeter.isLocal(binding) && libMeter.isProcessed(binding)) {
            return this.editAccValues(context, targetVal);
        } else if (!libMeter.isProcessed(binding)) {
            return this.replaceAccValues(context, targetVal);
        }
        return '';
    }

    /**
     * get Reconnect accessory target values based on Meter type
     * @param {IClientAPI} context
     * @param {Object} binding
     * @param {String} targetVal = 'Icon' | 'Label' | 'Action'
     */
    static getReconnectAccessoryTargetValues(context, binding, targetVal) {
        if (libMeter.isLocal(binding) && libMeter.isProcessed(binding)) {
            return this.takeReadingsAccValues(context, targetVal);
        } else if (!libMeter.isProcessed(binding)) {
            return this.reconnectAccValues(context, targetVal);
        }
        return '';
    }

     /**
     * get Disconnect accessory target values based on Meter type
     * @param {IClientAPI} context
     * @param {Object} binding
     * @param {String} targetVal = 'Icon' | 'Label' | 'Action'
     */
     static getDisconnectAccessoryTargetValues(context, binding, targetVal) {
        if (libMeter.isLocal(binding) && libMeter.isProcessed(binding)) {
            return this.takeReadingsAccValues(context, targetVal);
        } else if (!libMeter.isProcessed(binding)) {
            return this.disconnectAccValues(context, targetVal);
        }
        return '';
    }

    /**
     * get Repair accessory target values based on Meter type
     * @param {IClientAPI} context
     * @param {String} targetVal = 'Icon' | 'Label' | 'Action'
     */
    static getRepairAccessoryTargetValues(context, targetVal) {
        return this.takeReadingsAccValues(context, targetVal);
    }

    /**
     * get Reading accessory target values based on Meter type
     * @param {IClientAPI} context
     * @param {Object} binding
     * @param {String} targetVal = 'Icon' | 'Label' | 'Action'
     */
    static getReadingAccessoryTargetValues(context, binding, targetVal) {
        if (binding?.Device_Nav?.MeterReadings_Nav) {
            let allReadingsArray = binding.Device_Nav.MeterReadings_Nav;
    
            //We don't want to allow further readings if there exists an aperiodic reading with MRO
            //So we look for a reading with any of the aperiodic reason codes and a MR Doc ID
            let aperiodicReadingsWithMROFound = allReadingsArray.find(reading => {
                return reading.MeterReadingReason !== '01' && reading.MeterReadingDocID;
            });
    
            if (aperiodicReadingsWithMROFound !== undefined || allReadingsArray.length === 0) {
                return this.takeReadingsAccValues(context, targetVal);
            }
            return '';
        } else {
            return this.takeReadingsAccValues(context, targetVal);
        }
    }

    /**
     * getting edit button accessory values
     * Icon returns only Android icon!
     * @param {IClientAPI} context
     * @param {String} targetVal = 'Icon' | 'Label' | 'Action'
     */
    static editAccValues(context, targetVal) {
        switch (targetVal) {
            case 'Icon':
                return '/SAPAssetManager/Images/takeReadingsAccessory.android.png';
            case 'Label':
                return context.localizeText('update'); // same as take readings
            case 'Action':
                return '/SAPAssetManager/Rules/Meter/MeterEditFromDetailsNav.js';
            default:
                return '';
        }
    }

     /**
     * getting take reading button accessory values
     * Icon returns only Android icon!
     * @param {IClientAPI} context
     * @param {String} targetVal = 'Icon' | 'Label' | 'Action'
     */
     static takeReadingsAccValues(context, targetVal) {
        switch (targetVal) {
            case 'Icon':
                return '/SAPAssetManager/Images/takeReadingsAccessory.android.png';
            case 'Label':
                return context.localizeText('update'); // take readings, shorten view label
            case 'Action':
                return '/SAPAssetManager/Rules/Meter/MeterReadingsFromDetailsNav.js';
            default:
                return '';
        }
    }

    /**
     * getting replace button accessory values
     * Icon returns only Android icon!
     * @param {IClientAPI} context
     * @param {String} targetVal = 'Icon' | 'Label' | 'Action'
     */
    static replaceAccValues(context, targetVal) {
        switch (targetVal) {
            case 'Icon':
                return '/SAPAssetManager/Images/replaceAccessory.android.png';
            case 'Label':
                return context.localizeText('replace_meter');
            case 'Action':
                return '/SAPAssetManager/Rules/Meter/CreateUpdate/MeterReplaceUpdateNav.js';
            default:
                return '';
        }
    }

    /**
     * getting disconnect button accessory values
     * Icon returns only Android icon!
     * @param {IClientAPI} context
     * @param {String} targetVal = 'Icon' | 'Label' | 'Action'
     */
    static disconnectAccValues(context, targetVal) {
        switch (targetVal) {
            case 'Icon':
                return '/SAPAssetManager/Images/disconnectAccessory.android.png';
            case 'Label':
                return context.localizeText('disconnect');
            case 'Action':
                return '/SAPAssetManager/Rules/Meter/CreateUpdate/MeterDisconnectNav.js';
            default:
                return '';
        }
    }

     /**
     * getting reconnect button accessory values
     * Icon returns only Android icon!
     * @param {IClientAPI} context
     * @param {String} targetVal = 'Icon' | 'Label' | 'Action'
     */
     static reconnectAccValues(context, targetVal) {
        switch (targetVal) {
            case 'Icon':
                return '/SAPAssetManager/Images/reconnectAccessory.android.png';
            case 'Label':
                return context.localizeText('reconnect');
            case 'Action':
                return '/SAPAssetManager/Rules/Meter/CreateUpdate/MeterReconnectNav.js';
            default:
                return '';
        }
    }

    /**
     * getting uninstall button accessory values
     * Icon returns only Android icon!
     * @param {IClientAPI} context
     * @param {String} targetVal = 'Icon' | 'Label' | 'Action'
     */
    static uninstallAccValues(context, targetVal) {
        switch (targetVal) {
            case 'Icon':
                return '';
            case 'Label':
                return context.localizeText('meters_uninstall_btn');
            case 'Action':
                return '/SAPAssetManager/Rules/Meter/CreateUpdate/MeterRemoveUpdateNav.js';
            default:
                return '';
        }
    }

     /**
     * checking section visibility based on actual WO type
     * returns visibility based on target called section
     * @param {IClientAPI} context
     * @param {String} targetSection = 'QAB' | 'Install' | 'Uninstall' | 'Disconnect' | 'KPI'
     * @param {Object} replaceBinding
     */
    static async newObjectCellSectionVisible(context, targetSection, replaceBinding) {
        const orderType = await this.getWorkOrderISUProcessType(context, replaceBinding);
        const { 
            INSTALL,
            REP_INST,
            REPLACE,
            REMOVE,
            DISCONNECT,
            RECONNECT,
            REPAIR,
            READING,
        } = this.getMeterISOConstants(context);
        
        switch (targetSection) {
            case 'QAB':
                switch (orderType) {
                    case INSTALL:
                    case REP_INST:
                        return AllowMeterCreate(context, this.getWorkOrderBinding(context, replaceBinding));
                    case REMOVE:
                        return !IsClassicLayoutEnabled(context) 
                            && this.isTechObjectStarted(context, this.getWorkOrderBinding(context, replaceBinding));
                    default:
                        break;
                }
                break;
            case 'Install':
                switch (orderType) {
                    case INSTALL:
                    case REP_INST:
                    case REPLACE:
                    case REPAIR:
                    case READING:
                        return true;
                    default:
                        break;
                }
                break;
            case 'Uninstall':
                return orderType === REMOVE;
            case 'Disconnect':
                switch (orderType) {
                    case DISCONNECT:
                    case RECONNECT:
                        return true;
                    default:
                        break;
                }
                break;
            case 'KPI':
                return orderType === REMOVE;
            default:
                break;
        }
        return false;
    }

     /**
     * QAB and quick action target values
     * based on target value returns required rule/icon/label
     * @param {IClientAPI} context
     * @param {String} targetVal = 'Icon' | 'Label' | 'Action'
     * @param {Object} replaceBinding
     * @param {String} replaceType
     */
    static async quickActionTargetValues(context, targetVal, replaceBinding, replaceType) {
        const orderType = replaceType || await this.getWorkOrderISUProcessType(context, replaceBinding);
        const { 
            INSTALL,
            REP_INST,
            REPLACE,
            REMOVE,
            DISCONNECT,
            RECONNECT,
        } = this.getMeterISOConstants(context);

        switch (orderType) {
            case INSTALL:
            case REP_INST:
                switch (targetVal) {
                    case 'Icon':
                        return '$(PLT,/SAPAssetManager/Images/QABInstallMeter.png,/SAPAssetManager/Images/QABInstallMeter.android.png)';
                    case 'Label':
                        return context.localizeText('install_meter');
                    case 'Action':
                        return '/SAPAssetManager/Rules/Meter/CreateUpdate/MeterInstallUpdateNav.js';
                    default:
                        return '';
                }
            case RECONNECT:
                switch (targetVal) {
                    case 'Icon':
                        return '$(PLT,/SAPAssetManager/Images/QABReconnectMeter.png,/SAPAssetManager/Images/QABReconnectMeter.android.png)';
                    case 'Label':
                        return context.localizeText('reconnect_all_meters');
                    case 'Action':
                        return '';
                    default:
                        return '';
                }
            case DISCONNECT:
                switch (targetVal) {
                    case 'Icon':
                        return '$(PLT,/SAPAssetManager/Images/QABDisconnectMeter.png,/SAPAssetManager/Images/QABDisconnectMeter.android.png)';
                    case 'Label':
                        return context.localizeText('disconnect_all_meters');
                    case 'Action':
                        return '';
                    default:
                        return '';
                }
            case REPLACE:
                switch (targetVal) {
                    case 'Icon':
                        return '$(PLT,/SAPAssetManager/Images/QABReplaceMeter.png,/SAPAssetManager/Images/QABReplaceMeter.android.png)';
                    case 'Label':
                        return context.localizeText('replace_meter_long');
                    case 'Action':
                        return '';
                    default:
                        return '';
                }
            case REMOVE:
                switch (targetVal) {
                    case 'Icon':
                        return '$(PLT,/SAPAssetManager/Images/QABUninstallMeter.png,/SAPAssetManager/Images/QABUninstallMeter.android.png)';
                    case 'Label':
                        return context.localizeText('uninstall_meter_new');
                    case 'Action':
                        return IsUninstallMeterButtonEnabled(context).then(res => {
                            if (res) {
                                return '/SAPAssetManager/Rules/Meter/CreateUpdate/MeterRemoveUpdateNav.js';
                            } else {
                                EDTSoftInputModeConfig(context);
                                return '/SAPAssetManager/Actions/WorkOrders/Meter/MetersListViewWithActivityNav.action';
                            }
                        });
                    default:
                        return '';
                    }
            default:
                return '';
        }
    }

    /**
     * Nav action based on type of order
     * we're supporting new screens for Install/Uninstall only
     * @param {IClientAPI} context
     * @param {Object} replaceBinding
     */
    static async seeAllNavAction(context, replaceBinding) {
        const orderType = await this.getWorkOrderISUProcessType(context, replaceBinding);
        const { INSTALL, REP_INST, REMOVE } = this.getMeterISOConstants(context);

        switch (orderType) {
            case REMOVE: {
                EDTSoftInputModeConfig(context);
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/MetersListViewWithActivityNav.action');
            }
            case INSTALL:
            case REP_INST:
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/MeterListViewNav.action');
            default:
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/MetersListClassicViewNav.action');
        }
    }

     /**
     * In some cases context.binding doesn't contain OrderISULink data
     * in that case taking binding from getActionBinding() action
     * if context.binding pointing to expected target - returning undefined
     * @param {IClientAPI} context
     */
     static getMeterReplaceBinding(context) {
        let replaceBinding;
        if (context.binding['@odata.type'] !== '#sap_mobile.OrderISULink') {
            replaceBinding = context.getPageProxy().getActionBinding();
        }
        return replaceBinding;
    }

    /**
     * Parsing section name to target value that is used in the library
     * 'Install' | 'Uninstall' | 'Disconnect'
     * @param {String} sectionName
     */
    static sectionToTargetName(sectionName) {
        switch (sectionName) {
            case 'MeterListSection':
                return 'Install';
            case 'MeterListUninstallSection':
                return 'Uninstall';
            case 'MeterWithDisconnectionList':
                return 'Disconnect';
            default:
                return '';
        }
    }

    /**
     * Getting values for KPI header
     * @param {IClientAPI} context
     * @param {String} targetVal = 'Value' | 'Label'
     * @param {Object} replaceBinding
     */
    static async kpiHeaderTargetValues(context, targetVal, replaceBinding) {
        const { REMOVE } = this.getMeterISOConstants(context);
        const orderType = await this.getWorkOrderISUProcessType(context, replaceBinding);

        if (orderType === REMOVE) {
            switch (targetVal) {
                case 'Label':
                    return context.localizeText('meters_uninstalled');
                case 'Value':
                    return this.getOrderMeterItemsCount(context, replaceBinding, orderType);
                default:
                    return '';
            }
        }

        return '';
    }

     /**
     * Getting count of items, which were competed
     * with comparison to total amount
     * filtering based on target type
     * @param {IClientAPI} context
     * @param {Object} replaceBinding
     * @param {String} targetType
     */
    static async getOrderMeterItemsCount(context, replaceBinding, targetType) {
        const { REMOVE } = this.getMeterISOConstants(context);
        const replaceExpand = '$expand=OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav,OrderMobileStatus_Nav';
        const woBinding = await this.getWorkOrderDetailedBindingObject(context, replaceBinding, replaceExpand);
        const totalItemsCount = (woBinding.OrderISULinks || []).filter((item) => item.ISUProcess === targetType).length;
        let completedItemsCount = 0;

        if (targetType === REMOVE) {
            completedItemsCount = (woBinding.OrderISULinks || []).filter(
                (item) => item.Device_Nav.Equipment_Nav.ObjectStatus_Nav.Status === 'LOC01',
            ).length;
        }
        return completedItemsCount + '/' + totalItemsCount;
    }
}
