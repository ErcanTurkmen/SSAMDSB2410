import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function ExpensesPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Expenses/ExpensesListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'Confirmation');
}
