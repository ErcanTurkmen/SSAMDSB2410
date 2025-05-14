import { TagStates } from '../Details/OperationItemToolBarCaption';

export default function IsLockNumberEditable(context) {
    return context.binding.taggingState === TagStates.SetTagged;
}
