import VoyagesFilterCaptionInTransit  from './VoyagesFilterCaptionInTransit';
import { VOYAGES_INTRANSIT_FILTER } from './VoyagesOnLoadQuery';
/**
* This function sets default filter for Voyage List
* @param {IClientAPI} context
*/
export default function GetVoyagesPreSelectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'InTransitItems', [VoyagesFilterCaptionInTransit(context)],[VOYAGES_INTRANSIT_FILTER], true)];
}

