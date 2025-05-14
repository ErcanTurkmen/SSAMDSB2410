export default function InvolvedPartiesQueryOptions(context) {
    let expandList = [
        'Address_Nav',
        'Address_Nav/AddressCommunication',
        'AddressAtWork_Nav',
        'AddressAtWork_Nav/AddressAtWorkComm',
        'AddressAtWork_Nav/SAPUser_Nav',
        'WCMPartnerFunction_Nav',
        'Employee_Nav',
        'Employee_Nav/EmployeeAddress_Nav',
        'Employee_Nav/EmployeeCommunications_Nav',
        'BusinessPartner_Nav',
        'BusinessPartner_Nav/Address',
    ];
    let queryOptions = `$filter=WCMApplication eq '${context.binding.WCMApplication}'`;
    queryOptions += '&$expand=' + expandList.join(',');
    return queryOptions;
}
