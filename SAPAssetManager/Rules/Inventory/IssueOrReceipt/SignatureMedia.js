import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function SignatureMedia(context) {
    return CommonLibrary.getStateVariable(context, 'signature') || context.getPageProxy().getControl('FormCellContainer').getControl('SignatureCaptureFormCell').getValue();
}
