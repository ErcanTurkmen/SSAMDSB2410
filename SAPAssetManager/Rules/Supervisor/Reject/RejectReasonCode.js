import libCom from '../../Common/Library/CommonLibrary';

export default function RejectReasonCode(context) {
    return libCom.getStateVariable(context, 'RejectionReasonCode') || '';
}
