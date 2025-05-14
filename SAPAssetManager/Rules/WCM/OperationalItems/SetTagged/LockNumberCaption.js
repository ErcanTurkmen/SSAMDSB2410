import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { TagStates } from '../Details/OperationItemToolBarCaption';
import IsLockNumberRequired from './IsLockNumberRequired';

export default function LockNumberCaption(context) {
    return context.binding.taggingState === TagStates.SetTagged ? CommonLibrary.formatCaptionWithRequiredSign(context, 'lock_number', IsLockNumberRequired(context)) : context.localizeText('lock_number');
}
