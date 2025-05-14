import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function NoteContextMenuLeadingItems(context) {
    return CommonLibrary.isCurrentReadLinkLocal(context.binding['@odata.readLink']) ? ['DiscardNote'] : [];
}
