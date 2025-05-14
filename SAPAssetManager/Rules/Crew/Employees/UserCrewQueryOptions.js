import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';

export default function UserCrewQueryOptions(context) {
    let odataDate = "datetime'" + new ODataDate().toLocalDateString() + "'";
    let date = new Date();
    date.setDate(date.getDate() + 1);
    let offsetDate = "datetime'" + new ODataDate(date).toLocalDateString() + "'";
    
    return `$expand=CrewList,Employee&$filter=(Employee/UserID eq '${libCom.getSapUserName(context)}' or RemovalFlag ne 'X') and CrewList/OriginTimeStamp ge ${odataDate} and CrewList/OriginTimeStamp lt ${offsetDate} and CrewItemType eq 'EMPLOYEE'`;
}
