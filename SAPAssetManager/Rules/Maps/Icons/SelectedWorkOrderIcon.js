
import IconUtils from './IconUtils';
import libPersona from '../../Persona/PersonaLibrary';

const icon = 'MarkerJobSelected';
const serviceOrder = 'ServiceOrderSelected';

export default function SelectedWorkOrderIcon(context) {
    if (libPersona.isFieldServiceTechnician(context)) {
        return IconUtils.getIcon(context, serviceOrder);
    } else {
        return IconUtils.getIcon(context, icon);
    }
}
