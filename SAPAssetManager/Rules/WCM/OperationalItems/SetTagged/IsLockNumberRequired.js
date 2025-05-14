import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function IsLockNumberRequired(context) {
    return CommonLibrary.getAppParam(context, 'WCM', 'LockNumber.Mandatory') === 'Y';
}
