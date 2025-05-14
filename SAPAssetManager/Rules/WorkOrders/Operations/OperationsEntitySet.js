export default function OperationsEntitySet(context, bindingObject) {
	const binding = bindingObject || context.binding;
	if (binding && (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader' || binding['@odata.type'] === '#sap_mobile.WorkOrderHeader')) {
		return binding['@odata.readLink'] + '/Operations';
	} else {
		return 'MyWorkOrderOperations';
	}
}
