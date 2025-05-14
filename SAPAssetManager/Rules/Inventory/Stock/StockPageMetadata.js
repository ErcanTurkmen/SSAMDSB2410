import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function StockPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Inventory/Stock/StockListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MaterialSLoc');
}
