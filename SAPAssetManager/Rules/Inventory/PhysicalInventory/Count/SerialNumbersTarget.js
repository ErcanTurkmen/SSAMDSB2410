import libCom from '../../../Common/Library/CommonLibrary';

export default function SerialNumbersTarget(context) {

    let serialMap = libCom.getStateVariable(context, 'NewSerialMap');
    let serialArray = Array.from(serialMap.values());

    // sort by value
    serialArray.sort(function(a, b) { //Sort by newest, then by serial number (For those already in the entity)
        if (a.Date === b.Date) {
           return a.SerialNumber - b.SerialNumber;
        } else {
            return b.Date - a.Date;
        }
    });

    return serialArray;
}
