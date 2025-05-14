import libCommon from '../../Common/Library/CommonLibrary';

export default function SignatureCaption(context) {
    return libCommon.formatCaptionWithRequiredSign(context, 'signature', true);
}
