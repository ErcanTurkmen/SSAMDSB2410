import { TagStates } from '../Details/OperationItemToolBarCaption';

export default function IsVisibleLockNumber(context) {
    return !!(context.binding.taggingState === TagStates.SetTagged ||
        (context.binding.taggingState === TagStates.SetUntagged && context.binding.LockNumber));
}
