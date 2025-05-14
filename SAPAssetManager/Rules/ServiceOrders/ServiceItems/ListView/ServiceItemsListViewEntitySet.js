
export default function ServiceItemsListViewEntitySet(context) {
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
		return context.binding['@odata.readLink'] + '/ServiceItems_Nav';
	} else {
		return 'S4ServiceItems';
	}
}
