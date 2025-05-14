import NotificationDescriptionLengthValidation from '../../Utils/NotificationDescriptionLengthValidation';
import NotificationItemCreateUpdateResetValidation from './NotificationItemCreateUpdateResetValidation';


export default function ItemDescriptionChanged(context) {
    NotificationItemCreateUpdateResetValidation(context);
    NotificationDescriptionLengthValidation(context);
}
