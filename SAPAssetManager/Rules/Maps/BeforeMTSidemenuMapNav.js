import { ConstructMtMapPageNav } from './BeforeMTOverviewMapNav';
import BeforeMapNav from './BeforeMapNav';

export default function BeforeMTSidemenuMapNav(context) {
    return BeforeMapNav(context, ConstructMtMapPageNav(context, '/SAPAssetManager/Pages/Extensions/MapSideMenu.page'));
}
