
import IconUtils from './IconUtils';
import libPersona from '../../Persona/PersonaLibrary';

const icon = 'MarkerJob';
const serviceOrder = 'ServiceOrder';

export default function WorkOrderIcon(context) {
    if (libPersona.isFieldServiceTechnician(context)) {
        return IconUtils.getIcon(context, serviceOrder);
    } else {
        return IconUtils.getIcon(context, icon);
    }

}
