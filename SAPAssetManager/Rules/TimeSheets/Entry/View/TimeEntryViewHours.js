
import ConvertDoubleToHourString from '../../../Confirmations/ConvertDoubleToHourString';
import {TimeSheetLibrary as libTS} from '../../TimeSheetLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import libCrew from '../../../Crew/CrewLibrary';

export default function TimeEntryViewHours(context) {
    let hours = 0;
    const binding = context.binding;
    if (libCrew.isCrewFeatureEnabled(context) && !libVal.evalIsEmpty(binding) && Object.prototype.hasOwnProperty.call(binding,'CatsHours') && !libVal.evalIsEmpty(binding.CatsHours)) {
        hours = binding.CatsHours;
    } else if (!libVal.evalIsEmpty(binding) && Object.prototype.hasOwnProperty.call(binding,'Hours') && !libVal.evalIsEmpty(binding.Hours)) {
        hours = libTS.getActualHours(context, context.binding.Hours);
    }    
    return ConvertDoubleToHourString(hours);
}
