import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function TimeSheetListPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/TimeSheets/TimeSheetEntriesListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'CatsTimesheetOverviewRow');
}
