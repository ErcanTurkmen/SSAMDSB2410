import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function IsWCMSignatureEnabled(context) {
    return CommonLibrary.getAppParam(context, 'WCM', 'DocumentItem.SignatureEnabled') === 'Y';
}
