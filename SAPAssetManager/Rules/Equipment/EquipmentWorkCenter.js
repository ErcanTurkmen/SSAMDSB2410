import libCom from '../Common/Library/CommonLibrary';
import {ValueIfExists} from '../Common/Library/Formatter';
import IsOnlineFunctionalLocation from '../FunctionalLocation/IsOnlineFunctionalLocation';

export default async  function EquipmentWorkCenter(context) {
    if (context.binding?.['@odata.type'] === '#sap_mobile.Equipment') {
        const workCenterDescr = await libCom.getEntityProperty(context, 'WorkCenters', 'WorkCenterDescr');
        return ValueIfExists(workCenterDescr);
    }

    if (IsOnlineFunctionalLocation(context)) {
        const workCenterDescr = await libCom.getEntityProperty(context, 'WorkCenters', 'WorkCenterDescr');
        return ValueIfExists(workCenterDescr);
    }

    return ValueIfExists(context.binding.WorkCenter_Main_Nav, '-', function(value) {
        return value.WorkCenterDescr;
    });
}
