import libMobile from '../../../MobileStatus/MobileStatusLibrary';

export default function NotificationTaskDetailsMobileStatus(context) {
    return context.localizeText(libMobile.getMobileStatus(context.getPageProxy().binding, context));
}
