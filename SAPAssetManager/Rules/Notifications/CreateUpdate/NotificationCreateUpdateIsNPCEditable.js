import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function NotificationCreateUpdateIsNPCEditable(context) {
    return CommonLibrary.IsOnCreate(context);
}
