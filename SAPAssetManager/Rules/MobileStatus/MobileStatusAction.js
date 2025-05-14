import CascadingAction from '../Common/Action/CascadingAction';
import GenerateOffsetConfirmationNum from '../Confirmations/BlankFinal/GenerateOffsetConfirmationNum';
import GenerateConfirmationCounter from '../Confirmations/CreateUpdate/OnCommit/GenerateConfirmationCounter';
import FinalConfirmationOrderID from '../Confirmations/BlankFinal/FinalConfirmationOrderID';
import FinalConfirmationOperation from '../Confirmations/BlankFinal/FinalConfirmationOperation';
import FinalConfirmationSubOperation from '../Confirmations/BlankFinal/FinalConfirmationSubOperation';
import FinalConfirmation from '../Confirmations/BlankFinal/FinalConfirmation';
import ConfirmationCreateBlankReadLink from '../Confirmations/BlankFinal/ConfirmationCreateBlankReadLink';

export default class MobileStatusAction extends CascadingAction {

    entitySet() {
        return '';
    }

    identifier() {
        return '';
    }

    executeCreateBlankConfirmationIfMissing(context, instance) {
        if (instance.didSetConfirmationParams(context)) {
            // Execute the blank confirmation create action
            // Action override required to ensure context hasn't changed. Promises will not be resolved in time, hence Promise.all()
            return Promise.all([GenerateOffsetConfirmationNum(context), GenerateConfirmationCounter(context)]).then(([offsetconfirmationNum, confirmationCounter]) => {
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Confirmations/ConfirmationCreateBlank.action', 'Properties': {
                        'Properties': {
                            'ConfirmationNum': offsetconfirmationNum,
                            'ConfirmationCounter': confirmationCounter,
                            'FinalConfirmation': FinalConfirmation(context),
                            'OrderID': FinalConfirmationOrderID(context),
                            'Operation': FinalConfirmationOperation(context),
                            'SubOperation': FinalConfirmationSubOperation(context),
                            'StartDate': '/SAPAssetManager/Rules/Confirmations/BlankFinal/GetCurrentDate.js',
                            'StartTime': '/SAPAssetManager/Rules/Confirmations/BlankFinal/GetCurrentTime.js',
                            'FinishDate': '/SAPAssetManager/Rules/Confirmations/BlankFinal/GetCurrentDate.js',
                            'FinishTime': '/SAPAssetManager/Rules/Confirmations/BlankFinal/GetCurrentTime.js',
                            'PostingDate': '/SAPAssetManager/Rules/Confirmations/CreateUpdate/OnCommit/GetCreatedDate.js',
                            'CreatedDate': '/SAPAssetManager/Rules/Confirmations/CreateUpdate/OnCommit/GetCreatedDate.js',
                            'CreatedTime': '/SAPAssetManager/Rules/Confirmations/CreateUpdate/OnCommit/GetCreatedTime.js',
                        },
                        'CreateLinks': ConfirmationCreateBlankReadLink(context),
                        'Headers': {
                            'OfflineOData.TransactionID': offsetconfirmationNum,
                        },
                    },
                });
            });
        }
        return Promise.resolve(true);
    }

    setActionQueue(actionQueue) {
        // Put this action at the front of the queue
        actionQueue.unshift(this.executeCreateBlankConfirmationIfMissing);
        super.setActionQueue(actionQueue);
    }
}
