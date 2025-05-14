import { UpdateStateVariablesAfterDiscard } from './AfterErrorDiscard';
import DeleteEntitySuccessMessageNoClosePageWithAutoSave from './AutoSync/actions/DeleteEntitySuccessMessageNoClosePageWithAutoSave';

export default function AfterErrorDiscardNoClosePage(context) {
    UpdateStateVariablesAfterDiscard(context);
    return DeleteEntitySuccessMessageNoClosePageWithAutoSave(context);
}
