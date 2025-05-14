import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import libCom from '../../Common/Library/CommonLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import SmartFormsConfirmationLibrary from '../SmartFormsConfirmationLibrary';
import FSMFormSaveIOSAndroid from './FSMFormSave';
import FSMFormSaveWindows from './FSMFormSaveWindows';
import isWindows from '../../Common/IsWindows';

/**
* Reset the state varibales
* @param {IClientAPI} clientAPI
*/
export default function FSMFormClosePage(clientAPI) {
    let FSMFormSave = isWindows(clientAPI) ? FSMFormSaveWindows : FSMFormSaveIOSAndroid ;
    return FSMFormSave(clientAPI).then(() => {
        if (libCom.getStateVariable(clientAPI, 'FSMToastMessage') === 'CANCELCLOSE') { //User canceled page close becuase data would be lost
            libCom.removeStateVariable(clientAPI, 'FSMToastMessage');
            return Promise.resolve();
        }
        libCom.removeStateVariable(clientAPI, ['FSMFormInstanceCurrentChapterIndex', 'OnLoaded', 'FSMFormInstanceChapters', 'FSMFormInstanceControls', 'FSMFormInstanceVisibilityRules', 'FSMFormInstanceControlsInVisibilityRules', 'ChapterValuesFilePath', 'FSMFormInstanceControlsInCalculations', 'FSMFormInstanceCalculationRules']);
        ApplicationSettings.remove(clientAPI,'XMLTemplateParsed');
        if (libCom.getStateVariable(clientAPI, 'FSMClosedFlag')) { //Done with this smartform, so remove the last chapter from permanent storage
            let id = libCom.getStateVariable(clientAPI, 'CurrentInstanceID');
            ApplicationSettings.remove(clientAPI, id + '_lastChapter');
        }
        libCom.removeStateVariable(clientAPI, 'FSMClosedFlag');

        const isCompletionFlow = IsCompleteAction(clientAPI);
        if (isCompletionFlow) {
            if (libCom.getStateVariable(clientAPI, 'FSMToastMessage')) { //Either display save or closed toast message
                return clientAPI.executeAction('/SAPAssetManager/Actions/Forms/FSM/FSMInstanceUpdateToast.action').then(() => {
                    return navBackToSmartFormsCompletionListScreen(clientAPI);
                });
            }
            return navBackToSmartFormsCompletionListScreen(clientAPI);
        }

        if (SmartFormsConfirmationLibrary.isConfirmationAction(clientAPI)) {
            if (libCom.getStateVariable(clientAPI, 'FSMToastMessage')) { //Either display save or closed toast message
                return clientAPI.executeAction('/SAPAssetManager/Actions/Forms/FSM/FSMInstanceUpdateToast.action').then(() => {
                    return SmartFormsConfirmationLibrary.reopenConfirmationSmartFormsPage(clientAPI);
                });
            }
            return SmartFormsConfirmationLibrary.reopenConfirmationSmartFormsPage(clientAPI);
        }

        return clientAPI.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            if (libCom.getStateVariable(clientAPI, 'FSMToastMessage')) { //Either display save or closed toast message
                return clientAPI.executeAction('/SAPAssetManager/Actions/Forms/FSM/FSMInstanceUpdateToast.action');
            }
            return Promise.resolve();
        });
    });
}

function navBackToSmartFormsCompletionListScreen(clientAPI) {
    return WorkOrderCompletionLibrary.getInstance().openMainPage(clientAPI, false, {
        'Name': '/SAPAssetManager/Actions/WorkOrders/OpenCompleteWorkOrderPage.action',
        'Properties': {
            'ClearHistory': true,
            'Transition': {
                'Name': 'None',
            },
        },
    }).then(() => {
        return clientAPI.executeAction({
            'Name': '/SAPAssetManager/Actions/Forms/FSM/FSMFormsCompletionListNav.action',
            'Properties': {
                'Transition': {
                    'Name': 'None',
                },
            },
        });
    });
}
