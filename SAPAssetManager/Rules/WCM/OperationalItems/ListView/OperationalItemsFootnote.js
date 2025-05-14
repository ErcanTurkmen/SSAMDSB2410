import OperationalItemsTaggingUntaggingCond from './OperationalItemsTaggingUntaggingCond';

export default function OperationalItemsFootnote(context) {
    const opGroup = context.binding.WCMOpGroup_Nav;
    const text = `{cond}${opGroup ? ' - ' + opGroup.TextOpGroup : ''}`;

    return OperationalItemsTaggingUntaggingCond(context).then(condText => {
        return replaceConditionText(text, condText);
    });
}

function replaceConditionText(text, condVal = '-') {
    return text.replace('{cond}', condVal);
}
