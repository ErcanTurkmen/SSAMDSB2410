export default function BusinessPartnerQueryOptions(context) {
    let expandList = [
        'Address_Nav',
        'Address_Nav/AddressCommunication',
        'AddressAtWork_Nav',
        'AddressAtWork_Nav/AddressAtWorkComm',
        'PartnerFunction_Nav',
        'Employee_Nav',
        'Employee_Nav/EmployeeAddress_Nav',
        'Employee_Nav/EmployeeCommunications_Nav',
    ];

    if (context.binding) {
        const entityType = context.binding['@odata.type'];
        let partnerFuncLink = 'S4PartnerFunc_Nav';

        if (entityType.includes('S4Service')) {
            if (entityType === '#sap_mobile.S4ServiceRequest') {
                partnerFuncLink = 'S4PartnerFunction_Nav';
            }

            let partnerLink = 'BusinessPartner_Nav';
            if (entityType === '#sap_mobile.S4ServiceQuotation' || entityType === '#sap_mobile.S4ServiceQuotationItem') {
                partnerLink = 'S4BusinessPartner_Nav';
            }

            expandList = [
                partnerFuncLink,
                partnerLink,
                partnerLink + '/Customer_Nav',
                partnerLink + '/Address_Nav',
                partnerLink + '/Address_Nav/AddressCommunication',
                ...(entityType === '#sap_mobile.S4ServiceOrder' ? ['S4ServiceOrder_Nav'] : []),
                ...(entityType === '#sap_mobile.S4ServiceItem' ? ['S4ServiceItem_Nav'] : []),
            ];
        }
    }

    let queryOptions = '$expand=' + expandList.join(',');
    return queryOptions;
}
