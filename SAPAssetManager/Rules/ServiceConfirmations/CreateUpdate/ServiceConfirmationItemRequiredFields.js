import IsNonServiceItem from '../../ServiceItems/CreateUpdate/IsNonServiceItem';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ServiceConfirmationItemRequiredFields(context) {
    let requiredFields = [
        'DescriptionNote',
        'ItemCategoryLstPkr',
        'QuantitySimple',
    ];

    if (CommonLibrary.getPageName(context) === 'CreateServiceHocConfirmationItemScreen') {
        requiredFields.push('ProductIdLstPkr');
    } else {
        requiredFields.push('ServiceItemProperty');
    }

    return IsNonServiceItem(context).then(isNonServiceItem => {
        if (isNonServiceItem) {
            requiredFields.push('AmountProperty');
        }

        return requiredFields;
    });
}
