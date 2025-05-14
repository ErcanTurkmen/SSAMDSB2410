import IsPlantStandardModel from '../Common/IsPlantStandardModel';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import GetRelatedWorkOrdersData from './GetRelatedWorkOrdersData';

export default function GetRelatedWorkOrdersCount(context) {
    const binding = context.getPageProxy().binding;

    return IsPlantStandardModel(context, binding.PlanningPlant).then((isStandard) => {
        if (ValidationLibrary.evalIsEmpty(isStandard)) {
            return Promise.resolve(0);
        }

        return GetRelatedWorkOrdersData(context, isStandard).then((list) => {
            return list.length;
        });
    });
}
