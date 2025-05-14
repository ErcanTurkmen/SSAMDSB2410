import WorkPermitsPageMetadata from './WorkPermitsPageMetadata';

export default function EquipmentRelatedWorkPermitNav(context) {
    return NavToRelatedWorkPermitListPage(context, 'EquipmentRelatedWorkPermitListPage');
}

export function NavToRelatedWorkPermitListPage(context, relatedToName) {
    const page = WorkPermitsPageMetadata(context);
    page._Name = relatedToName;
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WCM/WorkPermitsListViewNav.action',
        'Properties': {
            'PageMetadata': page,
        },
    });
}
