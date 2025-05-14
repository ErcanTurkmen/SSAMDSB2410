import libCom from '../../../Common/Library/CommonLibrary';
export default function GetMovementTypeMandatoryCaption(context) {
    return libCom.formatCaptionWithRequiredSign(context, 'movement_type', true);
}
