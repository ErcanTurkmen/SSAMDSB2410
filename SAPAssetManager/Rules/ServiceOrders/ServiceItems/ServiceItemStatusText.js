import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

export default function ServiceItemStatusText(context) {
    let mobileStatus = MobileStatusLibrary.getMobileStatus(context.binding, context);
    return context.localizeText(mobileStatus);
}
