import WorkApprovalQABSettings from './WorkApprovalQABSettings';

export default function WorkApprovalQABChips(context) {
    const QABSettings = new WorkApprovalQABSettings(context.getPageProxy());

    return QABSettings.generateChips();
}
