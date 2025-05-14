import libCrew from '../CrewLibrary';
import { getPersonelNumForFilter } from '../../OverviewPage/TimeCaptureSection/AnotherTechnicianFormatFunctions';
import TimeCaptureSectionYesterdayHours from '../../OverviewPage/TimeCaptureSection/TimeCaptureSectionYesterdayHours';

export default function CrewTimeSheetsPreviousDayCrewMembers(context) {
    if (libCrew.isCrewFeatureEnabled(context)) {
        const crewMembersText = context.localizeText('crew_members');
        let date = new Date();
        date.setDate(date.getDate() - 1);
        return libCrew.getTotalCrewMembersWithDate(context,date).then((members) => {
            return members + ' ' + crewMembersText;
        });
    } else {
        const persNum = getPersonelNumForFilter(context);
        if (persNum) {
            return TimeCaptureSectionYesterdayHours(context);
        }
        return '';
    }
}
