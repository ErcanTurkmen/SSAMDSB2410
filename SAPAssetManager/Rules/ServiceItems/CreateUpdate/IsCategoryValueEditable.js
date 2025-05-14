import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function IsCategoryValueEditable(context) {
    return CommonLibrary.IsOnCreate(context) || CommonLibrary.isEntityLocal(context.binding);
}
