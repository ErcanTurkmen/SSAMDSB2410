import { TimeSheetLibrary as libTimesheet } from '../../TimeSheets/TimeSheetLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import ConvertDoubleToHourString from '../../Confirmations/ConvertDoubleToHourString';

export default function FormatHours(context) {
    let hours = 0;
    const binding = context.binding;
    
    if (!libVal.evalIsEmpty(binding) && Object.prototype.hasOwnProperty.call(binding,'CatsHours') && !libVal.evalIsEmpty(binding.CatsHours)) {
        hours = binding.CatsHours;
    } else if (!libVal.evalIsEmpty(binding) && Object.prototype.hasOwnProperty.call(binding,'Hours') && !libVal.evalIsEmpty(binding.Hours)) {
        hours = libTimesheet.getActualHours(context, binding.Hours);
    }

    return ConvertDoubleToHourString(hours);
}



