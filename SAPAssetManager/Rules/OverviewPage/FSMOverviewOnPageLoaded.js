import FSMOverviewHelpers from './Helpers/FSMOverviewHelpers';
import AnalyticsManager from '../AnalyticsManager/AnalyticsManagerLibrary';
import libCommon from '../Common/Library/CommonLibrary';

/**
* Need to generate missing overview rows on screen open
* @param {IClientAPI} context
*/
export default function FSMOverviewOnPageLoaded(context) {
    const selectedDefaultVal = FSMOverviewHelpers.defaultPeriodValue(context);
    const bounds = FSMOverviewHelpers.getBoundsFromSelectedValue(context, selectedDefaultVal);

    return FSMOverviewHelpers.updateDateRangeVariable(context, bounds, selectedDefaultVal).then(() => {
        if (libCommon.isApplicationLaunch(context)) {
            AnalyticsManager.fieldServiceTechnicaionAppLaunch();
        }
    });
}
