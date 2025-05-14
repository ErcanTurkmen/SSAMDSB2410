import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function FSMFormsPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Forms/FSM/FSMSmartFormsInstancesListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'FSMFormInstance');
}
