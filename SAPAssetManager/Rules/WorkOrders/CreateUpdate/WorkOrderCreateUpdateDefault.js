import libCommon from '../../Common/Library/CommonLibrary';
import assnType from '../../Common/Library/AssignmentType';
import { WorkOrderLibrary } from '../WorkOrderLibrary';
import WorkOrderCreateGetDefaultOrderType from './WorkOrderCreateGetDefaultOrderType';
import { GetWOGeometryDateFromPrevPageBinding } from './WorkOrderCreateUpdateOnPageLoad';
import { locationInfoFromObjectType } from '../../Common/GetLocationInformation';
import WorkOrderLocationFormat from '../WorkOrderLocationFormat';

function getDefaultValue(controlName) {
    let controlDefs = assnType.getWorkOrderAssignmentDefaults();
    return controlDefs[controlName].default;
}

/**
 * @param {IControlProxy} control
 */
export default async function WorkOrderCreateUpdateDefault(control) {
    let controlName = control.getName();
    let context = control.getPageProxy();
    /** @type {MyWorkOrderHeader} myWOHeader */
    const myWOHeader = context.binding;
    const onCreate = libCommon.IsOnCreate(context);
    const fromPreviousWO = WorkOrderLibrary.getFollowUpFlag(context) && WorkOrderLibrary.getFollowOnFlag(context);
    const isNewFromPrevious = checkIsNewFromPrevious(onCreate, fromPreviousWO);

    if (isNewFromPrevious) {  // creating a new order from the previous or update previous - prepopulate fields
        return ({
            'BusinessAreaLstPkr': () => myWOHeader.BusinessArea,
            'TypeLstPkr': () => myWOHeader.OrderType,
            'MainWorkCenterLstPkr': () => myWOHeader.MainWorkCenter,
            'WorkCenterPlantLstPkr': () => myWOHeader.MainWorkCenterPlant,
            'PlanningPlantLstPkr': () => myWOHeader.PlanningPlant,
            'DescriptionNote': () => myWOHeader.OrderDescription,
            'LocationEditTitle': async () => await Promise.all([
                GetWOGeometryDateFromPrevPageBinding(context),
                WorkOrderLocationFormat(context),
            ]).then(([geometryDataPageOnload, geometryDataFragment]) => geometryDataPageOnload ? locationInfoFromObjectType(context, geometryDataPageOnload.ObjectType, geometryDataPageOnload.ObjectKey) : geometryDataFragment),
        }[controlName] || (() => ''))();
    }

    switch (controlName) {  // creating a new order with default values - no follow-up
        case 'MainWorkCenterLstPkr':
            return libCommon.getStateVariable(context, 'WODefaultMainWorkCenter') || getDefaultValue('MainWorkCenter');
        case 'WorkCenterPlantLstPkr':
            return libCommon.getStateVariable(context, 'WODefaultWorkCenterPlant') || getDefaultValue('WorkCenterPlant');
        case 'PlanningPlantLstPkr':
            return libCommon.getStateVariable(context, 'WODefaultPlanningPlant') || getDefaultValue('PlanningPlant');
        case 'TypeLstPkr':
            return await WorkOrderCreateGetDefaultOrderType(context);
        case 'LocationEditTitle':
            return '';
        case 'DescriptionNote':
            return !WorkOrderLibrary.getFollowUpFlag(context) && myWOHeader ? myWOHeader.OrderDescription : '';
        default:
            return '';
    }
}

function checkIsNewFromPrevious(onCreate, fromPreviousWO) {
    return onCreate && fromPreviousWO || !onCreate;
}
