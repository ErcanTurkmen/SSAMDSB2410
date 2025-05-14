import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

const QUEUE_ACTIVITY_FLAG_NAME = 'BulkConfirmationActionQueueActive';
const QUEUE_NAME = 'BulkConfirmationActionQueue';

export function IsBulkConfirmationQueueActive(context) {
    return CommonLibrary.getStateVariable(context, QUEUE_ACTIVITY_FLAG_NAME);
}

/**
* Executes the next action from the queue
* If there is no action or the action type is incorrect, Promise.resolve is returned.
*
* @param {ClientAPI}
* @returns {Promise}
*/
export function RunNextBulkConfirmationAction(context) {
    if (!IsBulkConfirmationQueueActive(context)) return Promise.resolve();

    let action = GetBulkConfirmationNextAction(context);

    if (action && typeof action === 'function') {
        return action();
    }

    return Promise.resolve();
}

/**
* Removes the first action from the queue and returns it
* If there is no actions in the queue, deactivates the queue activity flag.
*
* @param {ClientAPI}
* @returns {Function|undefined}
*/
export function GetBulkConfirmationNextAction(context) {
    let nextAction;
    let queue = CommonLibrary.getStateVariable(context, QUEUE_NAME) || [];

    if (queue && queue.length) {
        nextAction = queue.shift();
        CommonLibrary.setStateVariable(context, QUEUE_NAME, queue);
        Logger.info(QUEUE_NAME, 'Action to run: ' + nextAction.name);
        Logger.info(QUEUE_NAME, 'Remaining actions in queue: ' + queue.length);
    } else {
        CommonLibrary.removeStateVariable(context, QUEUE_ACTIVITY_FLAG_NAME);
        Logger.info(QUEUE_NAME, 'No action to run');
    }

    return nextAction;
}

/**
* Adds an action to the queue
* Activates queue activity flag
*
* @param {ClientAPI}
* @param {Function}
*/
export function AddBulkConfirmationAction(context, action) {
    if (action && typeof action === 'function') {
        let queue = CommonLibrary.getStateVariable(context, QUEUE_NAME) || [];
        queue.push(action);

        CommonLibrary.setStateVariable(context, QUEUE_ACTIVITY_FLAG_NAME, true);
        CommonLibrary.setStateVariable(context, QUEUE_NAME, queue);
        Logger.info(QUEUE_NAME, 'New Action: ' + action.name);
        Logger.info(QUEUE_NAME, 'Queue Length: ' + queue.length);
    }
}

export function ResetBulkConfirmationQueue(context) {
    CommonLibrary.removeStateVariable(context, QUEUE_ACTIVITY_FLAG_NAME);
    CommonLibrary.removeStateVariable(context, QUEUE_NAME);
    Logger.info(QUEUE_NAME, 'Reset queue');
}
