import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';

/**
 * Gets Employee Query Options
 * Finds today's Crew Employees given today's date (normalized to UTC) from today's CrewList
 * Expands employee and orders by Last Name
 */
export default function EmployeeQueryOptions(context) {
    const itemType = context.getGlobalDefinition('/SAPAssetManager/Globals/Crew/ItemTypeEmployee.global').getValue();
    const crewId = libCom.getStateVariable(context, 'CrewHeaderCrewId');
    let filterQuery = '';

    if (crewId) {
        filterQuery = `$filter=RemovalFlag ne 'X' and CrewId eq '${crewId}' and CrewItemType eq '${itemType}'`;
    } else {
        let odataDate = "datetime'" + new ODataDate().toLocalDateString() + "'";
        let date = new Date();
        date.setDate(date.getDate() + 1);
        let offsetDate = "datetime'" + new ODataDate(date).toLocalDateString() + "'";
        
        filterQuery = `$filter=RemovalFlag ne 'X' and CrewList/SAPUserName eq '${libCom.getSapUserName(context)}' and CrewList/OriginTimeStamp ge ${odataDate} and CrewList/OriginTimeStamp lt ${offsetDate} and CrewItemType eq '${itemType}''`;
    }
  
    return `$expand=Employee,Employee/EmployeeCommunications_Nav&$orderby=Employee/LastName&${filterQuery}`;
}
