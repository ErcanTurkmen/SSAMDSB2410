import S4ServiceLibrary from '../../../ServiceOrders/S4ServiceLibrary';

export default function GetConfirmationObjectType(context) {
    let categories = S4ServiceLibrary.getServiceConfirmationCategories(context);
    if (categories.length) { 
        return categories[0]; 
    } else { 
        return 'BUS2000117'; 
    }
}
