import libCom from '../../Common/Library/CommonLibrary';

export default function ServiceOrderRequiredFields(context) {
    const requiredFields = [
        'DescriptionNote',
        'PrioritySeg',
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
