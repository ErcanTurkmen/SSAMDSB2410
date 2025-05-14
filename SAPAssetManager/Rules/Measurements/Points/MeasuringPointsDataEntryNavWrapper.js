import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';
import MeasuringPointsDataEntryNav from './MeasuringPointsDataEntryNav';
import MeasuringPointsEDTNav from './EDT/MeasuringPointsEDTNav';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function MeasuringPointsDataEntryNavWrapper(context) {
    CommonLibrary.setStateVariable(context, 'TransactionType', 'CREATE');

    if (PersonalizationPreferences.isMeasuringPointListView(context)) {
        return MeasuringPointsDataEntryNav(context);
    }
    return MeasuringPointsEDTNav(context);
}
