import { ValueIfExists } from '../Common/Library/Formatter';
import libSearch from './OnlineSearchLibrary';

export default function PlantWorkCenterValue(context) {
    const plant = context.binding.PlanningPlant || context.binding.MaintPlant;
    const plantDesc = libSearch.getCachedValue(context, 'Plants', plant, 'PlantDescription');
    const plantString = plantDesc ? `${plantDesc} (${plant})` : plant;
    const workCenterProp = context.binding['@odata.type'] === '#sap_mobile.Equipment' ? 'MaintWorkCenter' : 'WorkCenter';
    const workCetnerExtID = libSearch.getCachedValue(context, 'WorkCenters', context.binding[workCenterProp], 'ExternalWorkCenterId');

    return ValueIfExists(workCetnerExtID, plantString || '-', (workCenter) => {
        return workCenter ? `${plantString}, ${workCenter}` : plantString;
    });
}
