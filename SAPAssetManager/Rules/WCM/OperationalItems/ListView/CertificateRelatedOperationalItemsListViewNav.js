import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function CertificateRelatedOperationalItemsListViewNav(context) {
    const pageName = 'CertificateRelatedOperationalItemsListViewPage';
    CommonLibrary.setStateVariable(context, 'OperationalItemsListPageName', pageName);
    return NavToRelatedOperationalItemsListPage(context, pageName);
}

export function NavToRelatedOperationalItemsListPage(context, relatedToName) {
    const page = context.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/WCM/OperationalItems/OperationalItemsListView.page');
    page._Name = relatedToName;
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WCM/OperationalItems/OperationalItemsListViewNav.action',
        'Properties': {
            'PageMetadata': page,
        },
    });
}
