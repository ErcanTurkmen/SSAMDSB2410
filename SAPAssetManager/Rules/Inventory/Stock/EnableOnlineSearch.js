import EnableInventoryClerk from '../../SideDrawer/EnableInventoryClerk';

export default function EnableOnlineSearch(clientAPI) {
    return EnableInventoryClerk(clientAPI) && !clientAPI.isDemoMode();
}
