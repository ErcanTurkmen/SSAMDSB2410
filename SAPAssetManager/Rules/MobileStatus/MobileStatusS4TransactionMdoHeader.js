import AppVersionInfo from '../UserProfile/AppVersionInfo';

export default function MobileStatusS4TransactionMdoHeader(context) {
    return `SAM${AppVersionInfo(context).split('.')[0]}_S4_SRV_MOBILE_STATUS`;
}
