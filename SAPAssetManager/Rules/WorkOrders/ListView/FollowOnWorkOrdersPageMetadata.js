import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function FollowOnWorkOrdersPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/FollowOnWorkOrderListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyWorkOrderHeader');
}
