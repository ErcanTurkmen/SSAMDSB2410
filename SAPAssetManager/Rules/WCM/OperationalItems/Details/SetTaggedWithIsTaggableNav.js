import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import { CalculateActiveTagButton } from './OperationItemToolBarCaption';

export default async function SetTaggedWithIsTaggableNav(context) {
    if (ValidationLibrary.evalIsEmpty(context.binding.taggingState)) {  // in case we did not pass this in with the binding
        const taggingState = await CalculateActiveTagButton(context, context.binding);
        context.binding.taggingState = taggingState;
    }
    return context.executeAction('/SAPAssetManager/Actions/WCM/OperationalItems/SetTagged/SetTaggedNav.action');
}
