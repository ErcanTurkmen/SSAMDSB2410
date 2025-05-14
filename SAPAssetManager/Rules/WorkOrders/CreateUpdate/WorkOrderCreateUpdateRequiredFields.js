import DocumentFieldsAddRequired from '../../Documents/Create/DocumentFieldsAddRequired';
import { WorkOrderLibrary as libWo } from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateRequiredFields(context) {
    let requiredFields = [
        'DescriptionNote',
        'PlanningPlantLstPkr',
        'TypeLstPkr',
        'WorkCenterPlantLstPkr',
        'MainWorkCenterLstPkr',
    ];

    if (context.evaluateTargetPathForAPI('#Control:PrioritySeg').getVisible()) {
        requiredFields.push('PrioritySeg');
    } else {
        requiredFields.push('PriorityLstPkr');
    }

    DocumentFieldsAddRequired(context, requiredFields);

    return libWo.isSoldPartyRequired(context).then((required) => {
        if (required) {
            requiredFields.push('SoldToPartyLstPkr');
        }
        return requiredFields;
    });
}
