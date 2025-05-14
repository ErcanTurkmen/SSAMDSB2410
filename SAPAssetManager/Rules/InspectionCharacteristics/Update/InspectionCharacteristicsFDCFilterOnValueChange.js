
export default function InspectionCharacteristicsFDCFilterOnValueChange(context) {
    if (context.getName() === 'Equipment') {
        if (context.getValue().length > 0) {
            context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Equipment = context.getValue()[0].ReturnValue;
        } else {
            context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Equipment = '';
        }
    }

    if (context.getName() === 'FuncLoc') {
        if (context.getValue().length > 0) {
            context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FuncLoc = context.getValue()[0].ReturnValue;
        } else {
            context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FuncLoc = '';
        }
    }

    if (context.getName() === 'FilterSeg') {
        let values = [];
        let listPicker = context.getValue();
        for (let i=0 ; i<context.getValue().length ; i++) {
            values.push(listPicker[i].ReturnValue);
        }
        context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Segment = values;  
    }

    if (context.getName() === 'Operations') {
        if (context.getValue().length > 0) {
            let values = [];
            let listPicker = context.getValue();
            for (let i=0 ; i<context.getValue().length ; i++) {
                values.push(listPicker[i].ReturnValue);
            }
            context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().OperationsSelected = values;
        } else {
            context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().OperationsSelected = [];
        }
    }
}
