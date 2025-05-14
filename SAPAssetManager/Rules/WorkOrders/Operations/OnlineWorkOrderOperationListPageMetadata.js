import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function OnlineWorkOrderOperationListPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Operations/OnlineWorkOrderOperationsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyWorkOrderOperation');
}
