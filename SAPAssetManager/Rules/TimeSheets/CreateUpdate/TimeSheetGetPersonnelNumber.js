import IsAnotherTechnicianSelectEnabled from './IsAnotherTechnicianSelectEnabled';
import TimeSheetCreateUpdatePersonnelNumber from './TimeSheetCreateUpdatePersonnelNumber';
import {TimeSheetDetailsLibrary as libTSDetails} from '../TimeSheetLibrary';

/**
* If another technician select enabled - need to take personel number from picker, not take number of current user
* @param {IClientAPI} clientAPI
*/
export default function TimeSheetGetPersonnelNumber(clientAPI) {
    if (IsAnotherTechnicianSelectEnabled(clientAPI)) {
        return libTSDetails.TimeSheetSelectedPersonelNumber(clientAPI);
    }
    return TimeSheetCreateUpdatePersonnelNumber(clientAPI);
}
