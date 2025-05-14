import { TagStates } from '../Details/OperationItemToolBarCaption';

export default function SetTaggedUntaggedCaption(context) {
    return context.binding.taggingState === TagStates.SetTagged ? context.localizeText('set_tagged') : context.localizeText('set_untagged');
}
