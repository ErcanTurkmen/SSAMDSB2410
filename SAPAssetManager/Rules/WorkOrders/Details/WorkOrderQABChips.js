import WorkOrderQABSettings from './WorkOrderQABSettings';

export default function WorkOrderQABChips(context) {
    const QABSettings = new WorkOrderQABSettings(context.getPageProxy());

    return QABSettings.generateChips();
}
