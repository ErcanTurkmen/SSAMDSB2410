import libCom from '../../Common/Library/CommonLibrary';
import lib from './WorkOrderCompletionLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import libDigSig from '../../DigitalSignature/DigitalSignatureLibrary';
import libFeatures from '../../UserFeatures/UserFeaturesLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';
import IsServiceOrderReleased from '../../ServiceOrders/Status/IsServiceOrderReleased';
import sdfIsFeatureEnabled from '../../Forms/SDF/SDFIsFeatureEnabled';
import FormInstanceCount from '../../Forms/SDF/FormInstanceCount';

const STEPS_CONST = 'CompleteActions';
const OPERATION_FLOW_CONST = 'operation';
const SUB_OPERATION_FLOW_CONST = 'suboperation';
const SERVICE_ORDER_FLOW_CONST = 'service_order';
const SERVICE_ITEM_FLOW_CONST = 'service_item';

export default class WorkOrderCompletionLibrary {

    constructor() {
        this._instance = null;
        this._flow = ''; // 'service_order', 'operation', 'suboperation', '' (default) = 'WO'
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    static getStepNames() {
        return ['expenses', 'mileage', 'notification', 'digit_signature', 'signature', 'smartforms', 'sapdynamicforms', 'time', 'note', 'lam', 'confirmation', 'confirmation_item'];
    }

    getCompletionFlow() {
        return this._flow;
    }

    setCompletionFlow(flow) {
        this._flow = flow;
    }

    isWOFlow() {
        return this.getCompletionFlow() !== OPERATION_FLOW_CONST && this.getCompletionFlow() !== SUB_OPERATION_FLOW_CONST
            && this.getCompletionFlow() !== SERVICE_ORDER_FLOW_CONST && this.getCompletionFlow() !== SERVICE_ITEM_FLOW_CONST;
    }

    isOperationFlow() {
        return this.getCompletionFlow() === OPERATION_FLOW_CONST;
    }

    isSubOperationFlow() {
        return this.getCompletionFlow() === SUB_OPERATION_FLOW_CONST;
    }

    isServiceOrderFlow() {
        return this.getCompletionFlow() === SERVICE_ORDER_FLOW_CONST;
    }
    
    isServiceItemFlow() {
        return this.getCompletionFlow() === SERVICE_ITEM_FLOW_CONST;
    }

    async initSteps(context) {
        let steps = {};
        const names = lib.getStepNames();
        const isSupervisor = await libSuper.isUserSupervisor(context);

        for (const name of names) {
            steps[name] = {
                value: '',
                data: '',
                visible: false,
                isMandatory: false,
                link: '',
            };

            switch (name) {
                case 'expenses': {
                    steps[name].count = 0;
                    steps[name].visible = libFeatures.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Expense.global').getValue());
                    break;
                }
                case 'mileage': {
                    steps[name].visible = libFeatures.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/MileageReport.global').getValue());
                    break;
                }
                case 'notification': {
                    steps[name].initialData = '';
                    break;
                }
                case 'time': {
                    steps[name].isMandatory = false;
                    steps[name].visible = libSuper.isSupervisorFeatureEnabled(context) && isSupervisor ? libSuper.isSupervisorTimeEnabled(context) : true;
                    steps[name].lam = '';
                    break;
                }
                case 'note': {
                    steps[name].visible = libSuper.checkReviewRequired(context, context.binding);
                    break;
                }
                case 'sapdynamicforms': {
                    steps[name].count = 0;
                    if (sdfIsFeatureEnabled(context)) {
                        let count = await FormInstanceCount(context, true)
                        .catch((error) => {
                            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), error);
                            return 0;
                        });
    
                        steps[name].count = count;
                    }
                    steps[name].visible = steps[name].count > 0;
                    steps[name].isMandatory = steps[name].count > 0;
                    break;
                }
            }
        }

        if (this.isWOFlow()) {
            steps.signature.visible = !libVal.evalIsEmpty(libCom.getAppParam(context, 'SIGN_CAPTURE', 'WO.Complete')) && (libCom.getAppParam(context, 'SIGN_CAPTURE', 'WO.Complete') === 'Y' || libCom.getAppParam(context, 'SIGN_CAPTURE', 'WO.Complete') === 'O');
            steps.signature.isMandatory = steps.signature.visible && libCom.getAppParam(context, 'SIGN_CAPTURE', 'WO.Complete') !== 'O'; // visible and not optional
       
            steps.digit_signature.visible = libDigSig.isWODigitalSignatureEnabled(context);
            steps.digit_signature.isMandatory = libDigSig.isWODigitalSignatureMandatory(context);

            if (context.binding && context.binding.WOHeader && sdfIsFeatureEnabled(context)) {
                let count = await FormInstanceCount(context, true, context.binding.WOHeader['@odata.readLink']).catch((error) => {
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), error);
                    return 0;
                });
                steps.sapdynamicforms.count = count;
                steps.sapdynamicforms.visible = steps.sapdynamicforms.count > 0;
                steps.sapdynamicforms.isMandatory = steps.sapdynamicforms.count > 0;
            }
        } else if (this.isOperationFlow()) {
            steps.signature.visible = !libVal.evalIsEmpty(libCom.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete')) && (libCom.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete') === 'Y' || libCom.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete') === 'O');
            steps.signature.isMandatory = steps.signature.visible && libCom.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete') !== 'O'; // visible and not optional
       
            steps.digit_signature.visible = libDigSig.isOPDigitalSignatureEnabled(context);
            steps.digit_signature.isMandatory = libDigSig.isOPDigitalSignatureMandatory(context);
        } else if (this.isSubOperationFlow()) {
            steps.signature.visible = !libVal.evalIsEmpty(libCom.getAppParam(context, 'SIGN_CAPTURE', 'SubOp.Complete')) && (libCom.getAppParam(context, 'SIGN_CAPTURE', 'SubOp.Complete') === 'Y' || libCom.getAppParam(context, 'SIGN_CAPTURE', 'SubOp.Complete') === 'O');
            steps.signature.isMandatory = steps.signature.visible && libCom.getAppParam(context, 'SIGN_CAPTURE', 'SubOp.Complete') !== 'O'; // visible and not optional


            steps.mileage.visible = false;
            steps.expenses.visible = false;
        } else if (this.isServiceOrderFlow()) {
            steps.signature.visible = !libVal.evalIsEmpty(libCom.getAppParam(context, 'SIGN_CAPTURE', 'WO.Complete')) && (libCom.getAppParam(context, 'SIGN_CAPTURE', 'WO.Complete') === 'Y' || libCom.getAppParam(context, 'SIGN_CAPTURE', 'WO.Complete') === 'O');
            steps.signature.isMandatory = steps.signature.visible && libCom.getAppParam(context, 'SIGN_CAPTURE', 'WO.Complete') !== 'O'; // visible and not optional
       
            steps.digit_signature.visible = libDigSig.isWODigitalSignatureEnabled(context);
            steps.digit_signature.isMandatory = libDigSig.isWODigitalSignatureMandatory(context);

            steps.mileage.visible = false;
            steps.expenses.visible = false;
            steps.notification.visible = false;
            steps.time.visible = false;
            steps.confirmation.visible = IsServiceOrderReleased(context);
        } else if (this.isServiceItemFlow()) {
            steps.signature.visible = !libVal.evalIsEmpty(libCom.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete')) && (libCom.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete') === 'Y' || libCom.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete') === 'O');
            steps.signature.isMandatory = steps.signature.visible && libCom.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete') !== 'O'; // visible and not optional
       
            steps.digit_signature.visible = libDigSig.isOPDigitalSignatureEnabled(context);
            steps.digit_signature.isMandatory = libDigSig.isOPDigitalSignatureMandatory(context);
            
            steps.mileage.visible = false;
            steps.expenses.visible = false;
            steps.notification.visible = false;
            steps.time.visible = false;
            steps.confirmation.visible = IsServiceOrderReleased(context);
            steps.signature.visible = true;
            steps.signature.isMandatory = true;
        }

        libCom.setStateVariable(context, STEPS_CONST, steps);
    }

    initStep(context) { 
        libCom.setStateVariable(context, STEPS_CONST, {});
    }

    static getSteps(context) {
        return libCom.getStateVariable(context, STEPS_CONST) || {};
    }

    static clearSteps(context) {
        libCom.setStateVariable(context, STEPS_CONST, {});
    }

    static getStep(context, stepKey) {
        let steps = lib.getSteps(context);
        return steps[stepKey] || {};
    }

    static getStepValue(context, stepKey) {
        let step = lib.getStep(context, stepKey);    
        return step.value || '';
    }

    static getStepDataLink(context, stepKey) {
        let step = lib.getStep(context, stepKey);    
        return step.link || '';
    }

    static getStepData(context, stepKey) {
        let step = lib.getStep(context, stepKey);    
        return JSON.parse(step.data || '{}');
    }

    static getStepDataItemLink(context, stepKey) {
        let step = lib.getStep(context, stepKey);    
        return step.itemLinks || [];
    }

    static isStepDataExist(context, stepKey) {
        let step = lib.getStep(context, stepKey);
        return step && step.data;
    }

    static isStepVisible(context, stepKey) {
        let step = lib.getStep(context, stepKey);    
        return !!step.visible;
    }

    static isStepMandatory(context, stepKey) {
        let step = lib.getStep(context, stepKey);    
        return !!step.isMandatory;
    }

    static resetStep(context, link, additionalProperties = {}, useDeleteAction = false) {
        let properties = {
            'OnSuccess': '',
            'OnFailure': '',
        };

        if (link) {
            let entitySet = link.split('(')[0];
            properties.Target = {
                'EntitySet': entitySet,
                [useDeleteAction ? 'ReadLink' : 'EditLink']:  link,
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            };
        }

        return context.executeAction({
            'Name': useDeleteAction ? '/SAPAssetManager/Actions/Common/GenericDelete.action' : '/SAPAssetManager/Actions/Common/GenericDiscard.action', 
            'Properties': {...properties, ...additionalProperties},
        }).catch((failure) => {
            Logger.error('Discard failed', failure);
        });
    }

    static updateStepState(context, stepKey, data) {
        let step = lib.getStep(context, stepKey);    
        let updatedData = Object.assign(step, data);
        lib.getSteps(context)[stepKey] = updatedData;
    }

    openMainPage(context, simulateBackNavigation = true, navAction = null) {
        let binding;
        let bindingString = this.getInitialBinding(context);
        if (bindingString) {
            binding = JSON.parse(bindingString);
            if (context.getPageProxy && context.getPageProxy().setActionBinding) {
                context.getPageProxy().setActionBinding(binding);
            } else if (context.setActionBinding) {
                context.setActionBinding(binding);
            }
        }
        lib.setConfirmationType(context, '');

        let action = '/SAPAssetManager/Actions/WorkOrders/OpenCompleteWorkOrderPage.action';
        if (simulateBackNavigation) {
            action = '/SAPAssetManager/Actions/Common/CloseChildModal.action';
        } else if (navAction) {
            action = navAction;
        }

        return context.executeAction(action);
    }

    static validateSteps(context) {
        let steps = lib.getSteps(context);
        let valid = true;

        if (steps) {
            valid = !Object.keys(steps).find(key => {
                let step = steps[key];
                return step.isMandatory && !step.value && step.visible;
            });
        }
    
        return valid;
    }

    static areAnyStepsMandatory(context) {
        let steps = lib.getSteps(context);
        let result = false;

        if (steps) {
            result = Object.keys(steps).some(key => {
                let step = steps[key];
                return step.isMandatory && step.visible;
            });
        }
    
        return result;
    }

    setIsAutoCompleteOnApprovalFlag(context, value) {
        libCom.setStateVariable(context, 'IsAutoCompleteOnApproval', value);
    }

    getIsAutoCompleteOnApprovalFlag(context) {
        return libCom.getStateVariable(context, 'IsAutoCompleteOnApproval');
    }

    setCompleteFlag(context, value) {
        libCom.setStateVariable(context, this.getCompleteFlagName(context), value);
    }

    getCompleteFlagName(context) {
        let path = '';

        if (this.isWOFlow()) {
            path = '/SAPAssetManager/Globals/WorkOrder/WorkOrderCompletionFlag.global';
        } else if (this.isOperationFlow()) {
            path = '/SAPAssetManager/Globals/WorkOrder/OperationCompletionFlag.global';
        } else if (this.isSubOperationFlow()) {
            path = '/SAPAssetManager/Globals/WorkOrder/SubOperationCompletionFlag.global';
        } else if (this.isServiceOrderFlow()) {
            path = '/SAPAssetManager/Globals/WorkOrder/WorkOrderCompletionFlag.global';
        }

        return path ? context.getGlobalDefinition(path).getValue() : false;
    }

    getInitialBinding(context) {
        return ApplicationSettings.getString(context, this.getStoredBindingKey());
    }

    getBinding(context) {
        let binding = libCom.getBindingObject(context);

        if (binding) {
            if ((this.isWOFlow() && binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') ||
                (this.isOperationFlow() && binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') ||
                (this.isSubOperationFlow() && binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') ||
                (this.isServiceOrderFlow() && binding['@odata.type'] === '#sap_mobile.S4ServiceOrder')) {
                    return binding;
            }
        }

        let bindingString = this.getInitialBinding(context);
        if (bindingString) {
            binding = JSON.parse(bindingString);
        }
        libCom.setStateVariable(context, 'BINDINGOBJECT', binding);
        return binding;
    }

    setBinding(context, binding) {
        libCom.setStateVariable(context, 'BINDINGOBJECT', binding);
        ApplicationSettings.setString(context, this.getStoredBindingKey(), JSON.stringify(binding));
    }

    deleteBinding(context) {
        ApplicationSettings.remove(context, this.getStoredBindingKey());
    }

    getStoredBindingKey() {
        if (this.isWOFlow()) {
            return 'WO_Binding';
        } else if (this.isOperationFlow()) {
            return 'Operation_Binding';
        } else if (this.isSubOperationFlow()) {
            return 'Sub_Operation_Binding';
        } else if (this.isServiceOrderFlow()) {
            return 'Service_Order_Binding';
        }
        return '';
    }

    static setConfirmationType(context, type) {
        libCom.setStateVariable(context, 'ConfirmationType', type);
    }

    static getConfirmationType(context) {
        return libCom.getStateVariable(context, 'ConfirmationType') || '';   
    }

    static setValidationMessages(context, resetFlag) {
        let controls = context.getPageProxy().getControl('SectionedTable').getSection('MandatorySection').getBindingObject()._array;
        let steps = lib.getSteps(context);
        let stepNameAndControlIndexMapping = {
            'digit_signature': 3, 
            'signature': 1, 
            'smartforms': 5,
            'sapdynamicforms': 7,
        };
        if (steps) {
            Object.keys(steps).forEach(key => {
                let step = steps[key];
                let isNotValid = step.isMandatory && !step.value && step.visible;
                if (stepNameAndControlIndexMapping[key]) {
                    controls[stepNameAndControlIndexMapping[key]].rawData.SimplePropertyCell.Visible = resetFlag ? false : isNotValid;
                }
            });
        }
    }

    static resetValidationMessages(context) {
        const resetFlag = true;
        lib.setValidationMessages(context, resetFlag);
    }

    static resetValidationMessageForField(context, fieldName) {
        let controls = context.getPageProxy().getControl('SectionedTable').getSection('MandatorySection').getBindingObject()._array;

        let stepNameAndControlIndexMapping = {
            'digit_signature': 3, 
            'signature': 1, 
            'smartforms': 5,
        };

        if (stepNameAndControlIndexMapping[fieldName]) {
            controls[stepNameAndControlIndexMapping[fieldName]].rawData.SimplePropertyCell.Visible = false;
        }
    }

}
