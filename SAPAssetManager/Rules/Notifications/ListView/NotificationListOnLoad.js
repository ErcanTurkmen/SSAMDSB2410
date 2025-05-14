import FilterSettings from '../../Filter/FilterSettings';
import setCaption from './NotificationListSetCaption';

//Rule to call the caption again to load the count for quickFilter
export default function NotificationListOnLoad(context) {
    FilterSettings.saveInitialFilterForPage(context);
    FilterSettings.applySavedFilterOnList(context);
    return setCaption(context, true);
}
