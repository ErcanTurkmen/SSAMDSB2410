import libPersona from '../../Persona/PersonaLibrary';
import getWorkOrdersFSMQueryOption from './WorkOrdersFSMQueryOption';

export default function WorkOrderTypesPickerItems(context) {
    const queryBuilder = context.dataQueryBuilder();
    return (libPersona.isFieldServiceTechnician(context) ? getWorkOrdersFSMQueryOption(context).then(types => queryBuilder.filter(types)) : Promise.resolve())
        .then(() => {
            queryBuilder.orderBy('OrderType');
            return queryBuilder.build().then(result => {
                // decode to avoid encode query string twice
                return decodeURIComponent(result);
            });
        });
}
