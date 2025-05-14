
import GetCurrentGeometry from '../../Geometries/GetCurrentGeometry';

export default function NotificationGetCurrentLocation(context) {
    return GetCurrentGeometry(context, 'Notification').then(result => {
        if (result) {
            let container = context.getControls()[0];
            // redraw LocationButtonsSection 
            container.getSection('LocationButtonsSection').redraw();
        }
    });
}
