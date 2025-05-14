//import FilterLibrary from '../../../Filter/FilterLibrary';
import FilterOnLoaded from '../../../Filter/FilterOnLoaded';
/**
* This function sets datepicker values based on applied/persisted filters
* @param {IClientAPI} clientAPI
*/
export default function HUDelItemsSearchFilterOnLoaded(context) {
    FilterOnLoaded(context); //Run the default filter on loaded
}
