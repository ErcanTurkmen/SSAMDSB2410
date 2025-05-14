import EnableWorkOrderEdit from '../../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';

export default function IsNotesListCreateVisible(context) {
    const entityName = context.binding['@odata.type'].split('.')[1];
    switch (entityName) {
        case 'S4ServiceOrder':
        case 'S4ServiceRequest':
            return EnableWorkOrderEdit(context);
        default:
            return true;
    }
}
