import UnconfirmOperationMobileStatusAction from '../../Operations/MobileStatus/UnconfirmOperationMobileStatusAction';

export default class UnconfirmSubOperationMobileStatusAction extends UnconfirmOperationMobileStatusAction {

    didSetConfirmationParams(context) {
        context.getClientData().FinalConfirmationOrderID = this.args.WorkOrderId;
        context.getClientData().FinalConfirmationOperation = this.args.OperationId;
        context.getClientData().FinalConfirmationSubOperation = this.args.SubOperationId;
        context.getClientData().FinalConfirmation = '';

        this.args.subOperation.FinalConfirmationOrderID = this.args.WorkOrderId;
        this.args.subOperation.FinalConfirmationOperation = this.args.OperationId;
        this.args.subOperation.FinalConfirmationSubOperation = this.args.SubOperationId;
        this.args.subOperation.FinalConfirmation = '';
        return true;
    }

    entitySet() {
        return 'MyWorkOrderSubOperations';
    }

    identifier() {
        return `OperationNo='${this.args.OperationId}',OrderId='${this.args.WorkOrderId}',SubOperationNo='${this.args.SubOperationId}'`;
    }
}
