import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function PartsPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Parts/PartsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyWorkOrderComponent');
}
