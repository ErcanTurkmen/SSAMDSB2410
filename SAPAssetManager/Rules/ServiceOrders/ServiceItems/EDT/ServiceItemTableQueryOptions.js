import SubServiceItemQueryOptions from '../SubItem/SubServiceItemQueryOptions';

export default function ServiceItemTableQueryOptions(context) {
    if (context.binding?.['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        return SubServiceItemQueryOptions(context, true, false);
    }

    return '$orderby=ItemNo&$expand=Category1_Nav,Category2_Nav,Category3_Nav,Category4_Nav,ItemCategory_Nav,ServiceType_Nav,Product_Nav,MobileStatus_Nav,AccountingInd_Nav,TransHistories_Nav/S4ServiceContract_Nav,ServiceProfile_Nav,S4ServiceErrorMessage_Nav';
}
