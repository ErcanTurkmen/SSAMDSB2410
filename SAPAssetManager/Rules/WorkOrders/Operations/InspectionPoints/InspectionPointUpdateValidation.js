import libCom from '../../../Common/Library/CommonLibrary';

export default function InspectionPointUpdateValidation(context, section) {
    section.getControl('Valuation').clearValidation();
    let message = context.localizeText('field_is_required');
    if (section.getControl('Valuation').getValue().length === 0) {
        libCom.executeInlineControlError(context, section.getControl('Valuation'), message);
        return false;
    }
    return true;
}
