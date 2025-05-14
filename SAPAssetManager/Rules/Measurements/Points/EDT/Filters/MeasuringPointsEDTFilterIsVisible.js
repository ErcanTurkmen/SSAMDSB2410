import IsS4ServiceIntegrationEnabled from '../../../../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function MeasuringPointsEDTFilterIsVisible(context) {
    let filters = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().filters;

    switch (context.getName()) {
        case 'Equipment' : {
            return filters.EQUIPMENT && filters.EQUIPMENT.length > 0;
        }
        case 'FuncLoc': { 
            return filters.FLOC && filters.FLOC.length > 0;
        }
        case 'Operations' : {
            let isDataExist = filters.OPERATIONS && filters.OPERATIONS.length > 0;
            return IsS4ServiceIntegrationEnabled(context) ? false : isDataExist;
        }
        case 'S4Items': {
            let isDataExist = filters.OPERATIONS && filters.OPERATIONS.length > 0;
            return IsS4ServiceIntegrationEnabled(context) ? isDataExist : false;
        }
        case 'FilterPRT': {
            return filters.PRT && filters.PRT.length > 0;
        }
        default: {
            return true;
        }
    }
}
