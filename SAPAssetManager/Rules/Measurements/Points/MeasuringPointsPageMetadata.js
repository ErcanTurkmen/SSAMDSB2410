import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function MeasuringPointsPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Measurements/MeasuringPointsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MeasuringPoint');
}
