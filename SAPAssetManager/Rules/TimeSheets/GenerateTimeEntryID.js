import GenerateLocalID from '../Common/GenerateLocalID';

export default function GenerateTimeEntryID(context, extraOffset = 0) {
    let id = GenerateLocalID(context, 'CatsTimesheets', 'Counter', '0000000000', '', '', '', extraOffset);
    return id;
}
