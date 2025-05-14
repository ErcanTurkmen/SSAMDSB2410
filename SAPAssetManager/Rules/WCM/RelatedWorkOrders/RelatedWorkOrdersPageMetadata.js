import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function RelatedWorkOrdersPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WCM/RelatedWorkOrders/RelatedWorkOrdersListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyWorkOrderHeader');
}
