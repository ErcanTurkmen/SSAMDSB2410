import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function IsParentItemPickerEditable(context) {
    return CommonLibrary.IsOnCreate(context) ? true : CommonLibrary.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
}
