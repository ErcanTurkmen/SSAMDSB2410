import GetLocationInformation, { formatLocationInfo } from '../Common/GetLocationInformation';
import {ValueIfExists} from '../Common/Library/Formatter';
import libCommon from '../Common/Library/CommonLibrary';
import ApplicationSettings from '../Common/Library/ApplicationSettings';

export default function EquipmentLocationFormat(context) {
    const onCreate = libCommon.IsOnCreate(context);
    return GetLocationInformation(context, onCreate).then(oInfo => {
        let value = oInfo;
        if (oInfo && typeof oInfo === 'object' && 'geometryType' in oInfo && 'geometryValue' in oInfo) {
            value = formatLocationInfo(context, oInfo);
            libCommon.setStateVariable(context, 'GeometryObjectType', 'Equipment');
            ApplicationSettings.setString(context, 'Geometry', JSON.stringify(oInfo));
        }

        return ValueIfExists(value, context.localizeText('no_location_available'));
    });
}
