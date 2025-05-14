import InspectionLotSetUsageQueryOptions from './InspectionLotSetUsageQueryOptions';
import InspectionCodesSortedPickerItems from '../../../InspectionCharacteristics/InspectionCodesSortedPickerItems';

export default async function InspectionLotSetUsageInspectionCodesPickerItems(context) {
    const queryOptions = await InspectionLotSetUsageQueryOptions(context);

    return InspectionCodesSortedPickerItems(context, queryOptions);
}
