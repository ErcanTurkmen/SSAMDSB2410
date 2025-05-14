
export default async function EquipmentRelatedCertificateNav(context) {
    return NavToRelatedSafetyCertificateListPage(context, 'EquipmentRelatedCertificateListViewPage');
}

export function NavToRelatedSafetyCertificateListPage(context, relatedToName) {
    const page = context.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/WCM/SafetyCertificates/SafetyCertificatesListView.page');
    page._Name = relatedToName;
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WCM/SafetyCertificatesListViewNav.action',
        'Properties': {
            'PageMetadata': page,
        },
    });
}
