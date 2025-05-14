import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';

export default function IsServiceOrderLevel(context) {
    return MobileStatusLibrary.isServiceOrderStatusChangeable(context);
}
