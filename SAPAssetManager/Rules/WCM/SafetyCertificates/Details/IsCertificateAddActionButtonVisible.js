import EnableNotificationCreate from '../../../UserAuthorizations/Notifications/EnableNotificationCreate';
import IsLotoCertificate from './IsLotoCertificate';

/** @param {IPageProxy} context  */
export default function IsCertificateAddActionButtonVisible(context) {
    return Promise.all([
        IsLotoCertificate(context),
        EnableNotificationCreate(context),
    ]).then(isVisibles => isVisibles.some(i => !!i));
}
