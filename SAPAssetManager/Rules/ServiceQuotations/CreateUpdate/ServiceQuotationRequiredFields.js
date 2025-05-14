import libCom from '../../Common/Library/CommonLibrary';

export default function ServiceQuotationRequiredFields(context) {
    const requiredFields = [
        'DescriptionNote',
        'ProcessTypeLstPkr',
    ];

    if (libCom.IsOnCreate(context)) {
        requiredFields.push(
            'SoldToPartyLstPkr',
            'SalesOrgLstPkr',
            'ServiceOrgLstPkr',
            'BillToPartyLstPkr',
        );
    }

    return requiredFields;
}
