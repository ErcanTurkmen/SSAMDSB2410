
import libCom from '../Common/Library/CommonLibrary';

export default function PartsIssueEDTOnDelete(context) {
    let value = context?._control?.context?.binding?.MaterialNum;
    let inPartsList = libCom.getStateVariable(context, 'InPartsList');
    inPartsList = inPartsList.filter((item) => item !== value);
    libCom.setStateVariable(context, 'InPartsList', inPartsList);

    // update caption
    context.evaluateTargetPathForAPI('#Page:-Current').setCaption(context.localizeText('parts_x', [inPartsList.length]));

    // update EDT rows
    const filteredPartsList = [];
    const inPartsSet = new Set(inPartsList);
    for (let i = 0; i < context._control.getTable().getRowBindings().length; i++) {
        if (inPartsSet.has(context._control.getTable().getRowBindings()[i].MaterialNum)) {
            filteredPartsList.push(i);
        }
    }

    context._control.getTable().applyFilter(filteredPartsList);
}
