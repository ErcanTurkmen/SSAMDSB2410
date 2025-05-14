import CommonLibrary from '../Common/Library/CommonLibrary';
import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import OperationMobileStatusLibrary from '../Operations/MobileStatus/OperationMobileStatusLibrary';
import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
import FSMSmartFormsLibrary from './FSM/FSMSmartFormsLibrary';
import SmartFormsCompletionLibrary from './SmartFormsCompletionLibrary';

// Class handles smart-forms submission before confirming the operation
export default class SmartFormsConfirmationLibrary extends SmartFormsCompletionLibrary {

    /**
        Checks whether the chain of actions is a confirmation flow
        @param {IClientAPI} context
        @returns {boolean}
    */
    static isConfirmationAction(context) {
        const confirmationActionData = WorkOrderCompletionLibrary.getStep(context, 'smartforms').confirmationActionData;
        return !!confirmationActionData;
    }

    /**
        Simulates an operation completion flow to configure WorkOrderCompletionLibrary
        WorkOrderCompletionLibrary is used in conjunction with the SmartFormsCompletionLibrary
        @param {IClientAPI} context 
    */
    static setUpLibrary(context) {
        WorkOrderCompletionLibrary.getInstance().initStep(context);
        WorkOrderCompletionLibrary.getInstance().setCompletionFlow('operation');
        WorkOrderCompletionLibrary.getInstance().setBinding(context, context.binding);
    }

    /**
        Resets back WorkOrderCompletionLibrary configuration
        @param {IClientAPI} context 
    */
    static resetLibrary(context) {
        WorkOrderCompletionLibrary.clearSteps(context);
        WorkOrderCompletionLibrary.getInstance().setCompletionFlow('');
        WorkOrderCompletionLibrary.getInstance().deleteBinding(context);
    }

    /**
        Stores confirmation action data in the library
        @param {IClientAPI} context
        @param {Object} mobileStatus
        @param {boolean} review
        @param {Object} actionBinding
        @returns {Promise}
    */
    static storeActionData(context, smartForms, mobileStatus, review, actionBinding) {
        WorkOrderCompletionLibrary.updateStepState(context, 'smartforms', {
            visible: SmartFormsConfirmationLibrary.isSmartformsVisible(context, smartForms),
            value: SmartFormsConfirmationLibrary.getSmartformsStepValue(context, smartForms),
            isMandatory: SmartFormsConfirmationLibrary.isSmartformsMandatory(context, smartForms),
            confirmationActionData: {
                mobileStatus: mobileStatus,
                review: review,
                actionBinding: actionBinding,
            },
        });
    }

     /**
        Resets all changes made to smart-forms
        @param {IClientAPI} context
        @returns {Promise}
    */
    static resetUpdatedSmartForms(context) {
        let resetActions = [];
    
        let links = WorkOrderCompletionLibrary.getStep(context, 'smartforms').links || [];
        if (links.length) {
            links.forEach(link => {
                resetActions.push(WorkOrderCompletionLibrary.resetStep(context, link));
            });
        }
    
        return Promise.all(resetActions);
    }

    /**
        Returns the number of associated smart-forms to operation
        @param {IClientAPI} context
        @returns {Promise}
    */
    static async countSmartFormsAssociatedWithOperation(context) {
        if (FSMSmartFormsLibrary.isSmartFormsFeatureEnabled(context) && MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            SmartFormsConfirmationLibrary.setUpLibrary(context);
            let smartForms = await SmartFormsConfirmationLibrary.getSmartformsForCompletion(context);
            SmartFormsConfirmationLibrary.resetLibrary(context);

            return smartForms.length;
        }

        return Promise.resolve(0);
    }

    /**
        Opens the smart forms list page associated with the operation
        @param {IClientAPI} context
        @param {Object} mobileStatus
        @param {boolean} review
        @param {Object} actionBinding
        @returns {Promise}
    */
    static async openConfirmationSmartFormsPage(context, mobileStatus, review, actionBinding) {
        SmartFormsConfirmationLibrary.setUpLibrary();
        let smartForms = await SmartFormsConfirmationLibrary.getSmartformsForCompletion(context);
        SmartFormsConfirmationLibrary.storeActionData(context, smartForms, mobileStatus, review, actionBinding);

        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Forms/FSM/FSMFormsCompletionListNav.action',
            'Properties': {
                'PageMetadata': modifyFSMFormsCompletionListPage(context),
            },
        });
    }

    /**
        Reopens the smart forms list page associated with the operation after a form submission
        @param {IClientAPI} context
        @returns {Promise}
    */
    static reopenConfirmationSmartFormsPage(context) {
        return WorkOrderCompletionLibrary.getInstance().openMainPage(context, false, {
            'Name': '/SAPAssetManager/Actions/Forms/FSM/FSMFormsCompletionListNav.action',
            'Properties': {
                'PageMetadata': modifyFSMFormsCompletionListPage(context),
                'ClearHistory': true,
                'Transition': {
                    'Name': 'None',
                },
            },
        });
    }

    /**
        Closes the smart forms list page
        Returns the confirmation action data for the next action in the chain
        @param {IClientAPI} context
        @returns {Promise}
    */
    static closeConfirmationSmartFormsPage(context) {
        const confirmationActionData = WorkOrderCompletionLibrary.getStep(context, 'smartforms').confirmationActionData;
        SmartFormsConfirmationLibrary.resetLibrary(context);
        
        return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action').then(() => {
            context.dismissActivityIndicator();
            return confirmationActionData;
        });
    }

    /**
        Handles on press action of the cancel button on smart-forms list page
        If there are mandatory smart-forms, will show a warning message that the confirmation action will be stopped on cancelation 
        If there are no mandatory smart-forms, a confirmation action will be performed
        @param {IClientAPI} context
        @returns {Promise}
    */
    static onConfirmationSmartFormsPageCanceled(context) {
        const hasMandatoryForms = WorkOrderCompletionLibrary.isStepMandatory(context, 'smartforms');

        if (hasMandatoryForms) {
            return CommonLibrary.showWarningDialog(context, context.localizeText('canceling_completion_message'), context.localizeText('canceling_completion_title'))
                .then(() => {
                    return SmartFormsConfirmationLibrary.resetUpdatedSmartForms(context).then(() => {
                        return SmartFormsConfirmationLibrary.closeConfirmationSmartFormsPage(context);
                    });
                })
                .catch(() => {
                    return Promise.resolve();
                });
        }

        return SmartFormsConfirmationLibrary.resetUpdatedSmartForms(context).then(() => {
            return SmartFormsConfirmationLibrary.closeConfirmationSmartFormsPage(context).then((actionData) => {
                return continueConfirmationActionChain(context, actionData);
            });
        });
    }

    /**
        Handles on press action of the submit button on smart-forms list page
        If there are mandatory smart-forms, will show an error message that the forms completion required
        If there are no mandatory smart-forms, a confirmation action will be performed
        @param {IClientAPI} context
        @returns {Promise}
    */
    static async onSmartFormsConfirmationPageCommitted(context) {
        let smartForms = await SmartFormsConfirmationLibrary.getSmartformsForCompletion(context);
        const isAllMandatorySmartFormsCompleted = SmartFormsConfirmationLibrary.getSmartformsStepValue(context, smartForms);
        const hasMandatoryForms = WorkOrderCompletionLibrary.isStepMandatory(context, 'smartforms');

        if (isAllMandatorySmartFormsCompleted) {
            return SmartFormsConfirmationLibrary.closeConfirmationSmartFormsPage(context).then((actionData) => {
                return continueConfirmationActionChain(context, actionData);
            });
        } else if (hasMandatoryForms) {
            return CommonLibrary.showErrorDialog(context, context.localizeText('missing_mandatory_smartforms'), context.localizeText('error'));
        }

        return SmartFormsConfirmationLibrary.closeConfirmationSmartFormsPage(context).then((actionData) => {
            return continueConfirmationActionChain(context, actionData);
        });
    }
}

/**
    Modifies the smart-forms list page with action bar items
    @param {IClientAPI} context
    @returns {Page}
*/
function modifyFSMFormsCompletionListPage(context) {
    let page = context.getPageDefinition('/SAPAssetManager/Pages/Forms/FSM/FSMSmartFormsCompletionList.page');

    page.ActionBar.Items = [
        {
            'Position': 'left',
            'Text': '$(L,cancel)',
            'SystemItem': 'Cancel',
            'OnPress': '/SAPAssetManager/Rules/Forms/Confirmation/ConfirmationSmartFormsPageCanceled.js',
        },
        {
            'Position': 'right',
            'SystemItem': "$(PLT,'Done','', '','Done')",
            'Caption': '$(L,done)',
            'OnPress': '/SAPAssetManager/Rules/Forms/Confirmation/ConfirmationSmartFormsPageCommitted.js',
        },
    ];

    return page;
}

/**
    Continues the operation confirmation actions
    @param {IClientAPI} context
    @param {Object} actionData
    @returns {Promise}
*/
function continueConfirmationActionChain(context, actionData) {
    if (actionData) {
        return OperationMobileStatusLibrary.executeCompletionStepsAfterDigitalSignature(context, actionData.mobileStatus, actionData.review, actionData.actionBinding);
    } else {
        return Promise.resolve();
    }
}
