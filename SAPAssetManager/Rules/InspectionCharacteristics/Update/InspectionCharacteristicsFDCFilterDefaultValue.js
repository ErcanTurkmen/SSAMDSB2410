
export default function InspectionCharacteristicsFDCFilterDefaultValue(context) {
    
    if (context.getName() === 'Equipment') {
        return context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Equipment;
    } else if (context.getName() === 'FuncLoc') {
        return context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FuncLoc;
    } else if (context.getName() === 'FilterSeg') {
        return context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Segment;
    } else if (context.getName() === 'Operations') {
        return context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().OperationsSelected;
    }
}
