import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

export default function IsServiceItemLevel(context) {
    return MobileStatusLibrary.isServiceItemStatusChangeable(context);
}
