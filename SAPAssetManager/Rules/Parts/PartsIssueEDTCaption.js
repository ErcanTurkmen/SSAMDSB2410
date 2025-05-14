import libCom from '../Common/Library/CommonLibrary';

export default function PartsIssueEDTCaption(context) {
    const inPartsList = libCom.getStateVariable(context, 'InPartsList');
    return context?.localizeText('parts_x', [inPartsList?.length]);
}
