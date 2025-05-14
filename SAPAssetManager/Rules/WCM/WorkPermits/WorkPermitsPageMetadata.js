import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function WorkPermitsPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WCM/WorkPermits/WorkPermitsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'WCMApplication');
}
