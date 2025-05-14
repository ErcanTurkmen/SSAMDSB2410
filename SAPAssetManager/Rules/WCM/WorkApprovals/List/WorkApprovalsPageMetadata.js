import ModifyListViewTableDescriptionField from '../../../LCNC/ModifyListViewTableDescriptionField';

export default function WorkApprovalsPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WCM/WorkApprovals/WorkApprovalsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'WCMApproval');
}
