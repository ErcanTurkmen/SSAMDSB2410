import Logger from '../../Log/Logger';

export default function WorkOrderAssignRequiredFields(context) {
    let requiredFields = ['AssignToLstPkr'];

    try {
        if (context.evaluateTargetPathForAPI('#Control:WorkorderLstPkr').visible) {
            requiredFields.push('WorkorderLstPkr');
        }
    } catch (err) {
        Logger.error('WorkOrderAssignRequiredFields', err);
    }

    return requiredFields;
}
