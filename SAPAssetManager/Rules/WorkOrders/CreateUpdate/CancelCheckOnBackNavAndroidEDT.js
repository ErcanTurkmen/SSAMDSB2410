import CommonLibrary from '../../Common/Library/CommonLibrary';
import InspectionCharacteristicsEDTCheckForChangesBeforeClose from '../../InspectionCharacteristics/InspectionCharacteristicsEDTCheckForChangesBeforeClose';


/**
* Android-only action to prevent use of default back navigation (EDT specific)
* @param {IClientAPI} clientAPI
*/
export default function CancelCheckOnBackNavAndroidEDT(clientAPI) {
    CommonLibrary.cancelDefaultBackNavigationAndroid(clientAPI);
    return InspectionCharacteristicsEDTCheckForChangesBeforeClose(clientAPI);
}
