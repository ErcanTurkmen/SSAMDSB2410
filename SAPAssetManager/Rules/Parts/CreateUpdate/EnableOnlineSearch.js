import CheckForConnectivity from '../../Common/CheckForConnectivity';

export default function EnableOfflineSearch(context) {
    return (!context.isDemoMode() && CheckForConnectivity(context));
}
