import libCrew from './CrewLibrary';

export default function OverviewPageTimeCaptureDataSubscription(context) {
    let subscriptionArray = ['Confirmations', 'CatsTimesheets', 'ConfirmationOverviewRows', 'CatsTimesheetOverviewRows'];
    if (libCrew.isCrewFeatureEnabled(context)) {
        subscriptionArray.push('CrewLists');
        subscriptionArray.push('CrewListItems');
    }
    return subscriptionArray;
}
