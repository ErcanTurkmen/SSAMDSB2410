import filterLib from '../../Filter/FilterLibrary';

export default function InspectionCharacteristicsFDCFilterReset(context) {
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Equipment = '';
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FuncLoc = '';
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Segment = '';
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Operations = '';
    filterLib.setDefaultFilter(context.getPageProxy(), true);
}
