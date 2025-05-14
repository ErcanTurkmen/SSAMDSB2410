import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsAnotherTechnicianSelectEnabled from '../../TimeSheets/CreateUpdate/IsAnotherTechnicianSelectEnabled';

/**
 * check is feature enabled and personel number exists
 * if something is missed - returns empty string
*/ 
export function getPersonelNumForFilter(context) {
    const anotherTechFeatEnabled = IsAnotherTechnicianSelectEnabled(context);
    const personnelNum = CommonLibrary.getPersonnelNumber(context);
    return anotherTechFeatEnabled && personnelNum ? personnelNum : '';
}

/**
 * We require personel number filter to exist only in "StatusText"
 * in order to show 'My time' instead of total
 * Checking if feture enabled as welas personell num exists
 * Then return personel num if function call was from "StatusText" property
*/ 
export function getAdditionalUserFilterValue(context) {
    const personnelNum = getPersonelNumForFilter(context);
    const property = context.getProperty();
    return property === 'StatusText' ? personnelNum : '';
}

/**
 * Returning true for control that should be empty on screen
 * made for aviding to making extra reads and counts when label 100% would be empty
*/ 
export function checkEmptyStatusTextOnDisabledFeature(context) {
    const isfeatureEnabled = !!getPersonelNumForFilter(context);
    const property = context.getProperty();
    // if feфture enabled - making Subhead hidden
    if (isfeatureEnabled) {
        return property === 'Subhead';
    } else {
        return property === 'StatusText' || property === 'SubstatusText';
    }
}


/**
 * We require to show My time in "StatusText" property
 * and show Total time in "SubstatusText"
 * we should show empty string in "Subhead" if feature enabled
 * if feature disabled - return regular label - timeValue
*/ 
export function getTimeLabel(context, hours) {
    try {
        const personnelNum = getPersonelNumForFilter(context);
        const property = context.getProperty();
        const timeValue = context.localizeText('x_hours', [hours]);
        if (personnelNum) {
            switch (property) {
                case 'StatusText':
                    return context.localizeText('my_time', [timeValue]);
                case 'SubstatusText':
                    return context.localizeText('total_time', [timeValue]);
                case 'Subhead':
                default:
                    return ' ';
            }
        }
        return timeValue;
    } catch (err) {
        // context.getProperty() doesn't exists
        return '';
    }
}
