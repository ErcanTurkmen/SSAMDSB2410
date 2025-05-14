import S4ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';
import IsOrgDataEditable from './IsOrgDataEditable';

export default function ServiceRequestUpdateLinks(context) {
    const priority = S4ServiceRequestControlsLibrary.getPriority(context);
    const urgency = S4ServiceRequestControlsLibrary.getUrgency(context);
    const impact = S4ServiceRequestControlsLibrary.getImpact(context);
    const soldToPartyValue = S4ServiceRequestControlsLibrary.getSoldToParty(context);
    const updateLinks = [
		{
			'Property': 'Priority_Nav',
			'Target': {
				'EntitySet': 'ServicePriorities',
				'ReadLink': `ServicePriorities('${priority}')`,
			},
		},
		{
			'Property': 'Urgency_Nav',
			'Target': {
				'EntitySet': 'ServiceUrgencySet',
				'ReadLink': `ServiceUrgencySet('${urgency}')`,
			},
		},
		{
			'Property': 'Impact_Nav',
			'Target': {
				'EntitySet': 'ServiceImpactSet',
				'ReadLink': `ServiceImpactSet('${impact}')`,
			},
		},
	];

    if (IsOrgDataEditable(context) && soldToPartyValue) {
        updateLinks.push({
			'Property': 'Customer_Nav',
			'Target': {
				'EntitySet': 'S4BusinessPartners',
				'ReadLink': `S4BusinessPartners('${soldToPartyValue}')`,
			},
		});
    }

    return updateLinks;
}
