import IsS4Visible from '../S4RelatedHistories/IsS4Visible';
import EquipmentFunctionalLocationQABSettings from './EquipmentFunctionalLocationQABSettings';

export default function EquipmentFunctionalLocationQABChips(context) {
    const pageProxy = context.getPageProxy();
    const isS4 = IsS4Visible(pageProxy);
    const QABSettings = new EquipmentFunctionalLocationQABSettings(pageProxy, isS4);

    return QABSettings.generateChips();
}
