import InspectionCharacteristicsInspectionCodesQueryOptions from './InspectionCharacteristicsInspectionCodesQueryOptions';
import InspectionCodesSortedPickerItems from '../InspectionCodesSortedPickerItems';

export default function InspectionCharacteristicsInspectionCodesPickerItems(context) {
    const queryOptions = InspectionCharacteristicsInspectionCodesQueryOptions(context);

    return InspectionCodesSortedPickerItems(context, queryOptions);
}
