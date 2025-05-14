import WorkApprovalsPageMetadata from './WorkApprovalsPageMetadata';

export default function WorkPermitRelatedWorkApprovalsListNav(context) {
    return NavToRelatedWorkApprovalListPage(context, 'WorkPermitRelatedWorkApprovalsListViewPage');
}

function NavToRelatedWorkApprovalListPage(context, relatedToName) {
    const page = WorkApprovalsPageMetadata(context);
    page._Name = relatedToName;
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WCM/WorkApprovalsListViewNav.action',
        'Properties': {
            'PageMetadata': page,
        },
    });
}
