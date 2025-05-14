import setCaption from './InspectionLotListViewSetCaption';
import libCommon from '../../Common/Library/CommonLibrary';
import FilterSettings from '../../Filter/FilterSettings';

export default function InspectionLotListViewOnLoad(clientAPI) {
    FilterSettings.saveInitialFilterForPage(clientAPI);
    FilterSettings.applySavedFilterOnList(clientAPI);
    libCommon.setStateVariable(clientAPI, 'INSPECTION_LOT_FILTER', '');
    setCaption(clientAPI);
}
