import { CalculateActiveTagButton, TagStates } from './OperationItemToolBarCaption';

const TagStateActionButtonIconMap = Object.freeze({
    [TagStates.SetTagged]: 'ActionTagged',
    [TagStates.SetUntagged]: 'ActionUntagged',
});

export default async function SetTaggedUntagButtonMapIcon(context) {
    return TagStateActionButtonIconMap[(await CalculateActiveTagButton(context))] || '';
}
