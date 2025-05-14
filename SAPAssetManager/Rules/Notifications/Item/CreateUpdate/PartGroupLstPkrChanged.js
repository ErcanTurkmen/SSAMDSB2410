import NotificationItemCreateUpdatePart from './NotificationItemCreateUpdatePart';
import NotificationItemCreateUpdateResetValidation from './NotificationItemCreateUpdateResetValidation';


export default function PartGroupLstPkrChanged(context) {
    NotificationItemCreateUpdateResetValidation(context);
    NotificationItemCreateUpdatePart(context);
}
