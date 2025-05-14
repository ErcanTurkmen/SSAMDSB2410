import BeforeMapNav from './BeforeMapNav';

export default function BeforeWCMMapNav(clientAPI) {
    return BeforeMapNav(clientAPI, '/SAPAssetManager/Actions/Extensions/WCMMapNav.action');
}
