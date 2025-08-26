export default function PriorityQueryOptions(context) {   
    if (context?.binding && context?.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return "$filter=PriorityType eq 'PM'&$orderby=Priority";
    }
    return (context?.binding && context?.binding?.PriorityType) ? `$filter=PriorityType eq '${context.binding.PriorityType}'&$orderby=Priority` : 'orderby=Priority';
}
