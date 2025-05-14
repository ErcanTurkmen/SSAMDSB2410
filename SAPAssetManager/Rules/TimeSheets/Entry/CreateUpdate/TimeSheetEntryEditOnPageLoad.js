import { TimeSheetEventLibrary as libTSEvent} from '../../TimeSheetLibrary';
import style from '../../../Common/Style/StyleFormCellButton';
import hideCancel from '../../../ErrorArchive/HideCancelForErrorArchiveFix';
import libCom from '../../../Common/Library/CommonLibrary';
import Stylizer from '../../../Common/Style/Stylizer';
import libCrew from '../../../Crew/CrewLibrary';

export default function TimeSheetEntryEditOnPageLoad(pageClientAPI) {
    hideCancel(pageClientAPI);
    style(pageClientAPI, 'DiscardButton');
    libTSEvent.TimeSheetEntryEditOnPageLoad(pageClientAPI);
    libCom.saveInitialValues(pageClientAPI);
    if (libCrew.isCrewFeatureEnabled(pageClientAPI)) {
        libCom.setStateVariable(pageClientAPI, 'CrewTimeEntryOriginal', pageClientAPI.binding.Hours);
        let endDateControl = libCom.getControlProxy(pageClientAPI,'DatePicker');
        libCom.setFormcellNonEditable(endDateControl); //Crew timesheet edit will not allow changing of date
        let readOnlyStylizer = new Stylizer(['GrayText']);
        readOnlyStylizer.apply(endDateControl, 'Value');
    }
}
