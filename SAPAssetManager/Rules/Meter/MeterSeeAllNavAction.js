import MeterSectionLibrary from './Common/MeterSectionLibrary';

export default function MeterSeeAllNavAction(clientAPI) {
    return MeterSectionLibrary.seeAllNavAction(clientAPI, clientAPI.getPageProxy()?.binding);
}
