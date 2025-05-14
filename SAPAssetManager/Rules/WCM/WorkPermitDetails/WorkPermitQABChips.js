import WorkPermitQABSettings from './WorkPermitQABSettings';

export default function WorkPermitQABChips(context) {
    const QABSettings = new WorkPermitQABSettings(context.getPageProxy());

    return QABSettings.generateChips();
}
