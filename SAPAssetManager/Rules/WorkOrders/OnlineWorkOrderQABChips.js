import OnlineWorkOrderQABSettings from './Details/OnlineWorkOrderQABSettings';

export default function OnlineWorkOrderQABChips(context) {
    const QABSettings = new OnlineWorkOrderQABSettings(context.getPageProxy());

    return QABSettings.generateChips();
}
 
