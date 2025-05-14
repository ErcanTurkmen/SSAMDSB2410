import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import NotificationTypeLstPkrDefault from '../NotificationTypePkrDefault';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function PartnerCaption(context) {
	const requiredMark = PersonaLibrary.isFieldServiceTechnician(context) ? '*' : '';
	let reads = [context.read('/SAPAssetManager/Services/AssetManager.service', 'NotifPartnerDetProcs', [], `$orderby=PartnerFunction&$expand=PartnerFunction_Nav&$top=2&$filter=NotifType eq '${NotificationTypeLstPkrDefault(context)}' and PartnerIsMandatory eq 'X' and sap.entityexists(PartnerFunction_Nav)`)];

	if (context.getPageProxy().binding['@odata.readLink']) {
		const partnerNavLink = getPartnerNavLink(context, context.getPageProxy().binding['@odata.type']);
		reads.push(context.read('/SAPAssetManager/Services/AssetManager.service', `${context.getPageProxy().binding['@odata.readLink']}/${partnerNavLink}`, [], '$orderby=PartnerFunction&$expand=PartnerFunction_Nav'));
	} else {
		reads.push([]);
	}

	return Promise.all(reads).then(results => {
		if (results[1].length > 0) { // Edit
			return getCreateResult(context, results[1], requiredMark);
		} else if (results[0].length > 0) {	// Create
			return getCreateResult(context, results[0], requiredMark);
		} else {
			return '';
		}
	});
}

function getCreateResult(context, result, requiredMark) {
	if (context.getName() === 'PartnerPicker1' && !ValidationLibrary.evalIsEmpty(result.getItem(0)))
		return `${result.getItem(0).PartnerFunction_Nav.Description}${requiredMark}`;
	else if (context.getName() === 'PartnerPicker2' && !ValidationLibrary.evalIsEmpty(result.getItem(1)))
		return `${result.getItem(1).PartnerFunction_Nav.Description}${requiredMark}`;
	else
		return '';
}

function getPartnerNavLink(context, dataType) {
	switch (dataType) {
		case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue()):
		case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue()):
			return 'Partners';
		case (context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue()):
			return 'WOPartners';
		default:
			return 'Partners';
	}
}
