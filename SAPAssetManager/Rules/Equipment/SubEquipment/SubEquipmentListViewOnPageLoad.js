import FilterSettings from '../../Filter/FilterSettings';
import setSubEquipmentListViewPageCaption from './SubEquipmentListViewPageCaption';

export default function SubEquipmentListViewOnPageLoad(context) {
    FilterSettings.saveInitialFilterForPage(context);
    FilterSettings.applySavedFilterOnList(context);
    setSubEquipmentListViewPageCaption(context);
}
