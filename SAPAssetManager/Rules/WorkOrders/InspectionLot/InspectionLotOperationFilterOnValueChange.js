import libEval from '../../Common/Library/ValidationLibrary';
import RedrawFilterToolbar from '../../Filter/RedrawFilterToolbar';

export default function InspectionLotOperationFilterOnValueChange(context) {
    let opSelection = context.getValue()[0] ? context.getValue()[0].ReturnValue : '';
    let clientData = context.evaluateTargetPath('#Page:InspectionLotListViewPage/#ClientData');
    clientData.operationFilter = libEval.evalIsEmpty(opSelection) ? undefined : opSelection;
    RedrawFilterToolbar(context);
}
