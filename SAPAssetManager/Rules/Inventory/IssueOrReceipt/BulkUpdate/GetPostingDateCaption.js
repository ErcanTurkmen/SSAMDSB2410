import libCom from '../../../Common/Library/CommonLibrary';

export default function GetPostingDateCaption(context) {
    return libCom.formatCaptionWithRequiredSign(context, 'posting_date', true);
}
