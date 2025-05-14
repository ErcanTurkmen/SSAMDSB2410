import NotificationItemCreateUpdateDamage from './NotificationItemCreateUpdateDamage';
import NotificationItemCreateUpdateResetValidation from './NotificationItemCreateUpdateResetValidation';


export default function DamageGroupLstPkrChanged(context) {
    NotificationItemCreateUpdateResetValidation(context);
    NotificationItemCreateUpdateDamage(context);
}
