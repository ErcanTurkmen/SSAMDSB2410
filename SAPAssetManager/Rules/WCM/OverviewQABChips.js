import OverviewQABSettings from './QAB/OverviewQABSettings';

export default function OverviewQABChips(context) {
    const QABSettings = new OverviewQABSettings(context.getPageProxy());

    return QABSettings.generateChips();
}
