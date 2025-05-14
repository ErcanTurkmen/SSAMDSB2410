import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function RoutesPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Meter/Periodic/RoutesListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MeterReadingUnit');
}
