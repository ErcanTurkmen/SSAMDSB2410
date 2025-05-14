
import { ValueIfExists } from '../Common/Library/Formatter';
import libCommon from '../Common/Library/CommonLibrary';
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import EnableFieldServiceTechnician from '../SideDrawer/EnableFieldServiceTechnician';
import AddressMapValue from '../Maps/AddressMapValue';
import GetLocationInformation, { formatLocationInfo } from '../Common/GetLocationInformation';

export default function WorkOrderLocationFormat(context) {
    let isFieldServiceTechnician = EnableFieldServiceTechnician(context);
    if (isFieldServiceTechnician) {
        let address = context.binding.address;

        if (address) {
            return libCommon.oneLineAddress(address);
        } else {
            return AddressMapValue(context).then(() => {
                address = context.binding.address;

                if (address) {
                    return libCommon.oneLineAddress(address);
                } else {
                    return context.localizeText('no_address_available');
                }
            });
        }
    } else {
        const onCreate = libCommon.IsOnCreate(context);
        return GetLocationInformation(context, onCreate).then(oInfo => {
            let value = oInfo;
            if (typeof oInfo === 'object' && oInfo !== null) {
                value = formatLocationInfo(context, oInfo);
                libCommon.setStateVariable(context, 'GeometryObjectType', 'WorkOrder');
                ApplicationSettings.setString(context, 'Geometry', JSON.stringify(oInfo));
            }

            return ValueIfExists(value, context.localizeText('no_location_available'));
        });
    }
}
