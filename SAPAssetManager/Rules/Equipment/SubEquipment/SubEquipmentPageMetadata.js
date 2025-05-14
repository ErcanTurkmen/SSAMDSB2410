import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function SubEquipmentPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Equipment/SubEquipment/SubEquipmentListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyEquipment');
}
