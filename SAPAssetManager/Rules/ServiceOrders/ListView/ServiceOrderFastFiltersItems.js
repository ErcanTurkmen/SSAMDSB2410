import CommonLibrary from '../../Common/Library/CommonLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import { S4ServiceOrderFastFilters } from '../../FastFilters/S4FSMFastFilters/S4ServiceOrderFastFilters';


const Assignment = Object.freeze({
    type_1: '1',
    type_2: '2',
});

export function isAssignment1or2(context) {
    return PersonaLibrary.isFieldServiceTechnician(context) && [Assignment.type_1, Assignment.type_2].includes(CommonLibrary.getS4AssignmentType(context));
}

/**
 * @typedef SOListPageClientData
 * @prop {S4ServiceOrderFastFilters} SOFastFilters
 */

export default function ServiceOrderFastFiltersItems(context) {
    const soFastFilters = new S4ServiceOrderFastFilters(context);

    context.getPageProxy().getClientData().SOFastFilters = soFastFilters;
    return soFastFilters.getFastFilterItemsForListPage(context);
}
