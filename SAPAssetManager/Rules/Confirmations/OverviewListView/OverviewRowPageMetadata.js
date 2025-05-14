import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function OverviewRowPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Confirmations/ConfirmationsOverviewListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'ConfirmationOverviewRow');
}
