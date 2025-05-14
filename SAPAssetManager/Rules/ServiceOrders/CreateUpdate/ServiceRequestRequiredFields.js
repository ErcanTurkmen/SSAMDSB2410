import libCom from '../../Common/Library/CommonLibrary';

export default function ServiceRequestRequiredFields(context) {
    const requiredFields = [
        'DescriptionNote',
        'PrioritySeg',
        'UrgencySeg',
        'ImpactSeg',
    ];

    if (libCom.IsOnCreate(context)) {
        requiredFields.push(
            'SoldToPartyLstPkr',
            'SalesOrgLstPkr',
            'ServiceOrgLstPkr',
        );
    }

    return requiredFields;
}
