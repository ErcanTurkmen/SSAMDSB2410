
export default function ServiceConfirmationRequiredFields(context) {
    let requiredFields = [
        'DescriptionNote',
    ];
 
    if (context.evaluateTargetPathForAPI('#Control:ServiceOrderLstPkr').getVisible()) {
        requiredFields.push('ServiceOrderLstPkr');
    }

    return requiredFields;
}
