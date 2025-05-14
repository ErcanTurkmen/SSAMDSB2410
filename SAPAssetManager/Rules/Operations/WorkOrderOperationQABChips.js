import WorkOrderOperationQABSettings from './WorkOrderOperationQABSettings';

export default function WorkOrderOperationQABChips(context) {
    const QABSettings = new WorkOrderOperationQABSettings(context.getPageProxy());

    return QABSettings.generateChips();
}
