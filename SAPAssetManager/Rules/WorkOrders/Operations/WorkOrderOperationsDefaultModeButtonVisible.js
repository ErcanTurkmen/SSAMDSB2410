import PersonaLibrary from '../../Persona/PersonaLibrary';
import WorkOrderStartedOrOperationLevelAssignment from './WorkOrderStartedOrOperationLevelAssignment';

export default function WorkOrderOperationsDefaultModeButtonVisible(context) {
	if (PersonaLibrary.isMaintenanceTechnician(context)) {
		if (context.getPageProxy().getControl('SectionedTable') && context.getPageProxy().getControl('SectionedTable').getSections()[0].getSelectionMode() === 'Multiple') {
			return false;
		}

		return WorkOrderStartedOrOperationLevelAssignment(context);
	}
	return false;
}
