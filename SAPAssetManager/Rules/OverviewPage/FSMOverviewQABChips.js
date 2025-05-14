import FSMOverviewQABSettings from './FSMOverviewQABSettings';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function FSMOverviewQABChips(context) {
    const pageProxy = context.getPageProxy();
    const isS4 = IsS4ServiceIntegrationEnabled(pageProxy);
    const QABSettings = new FSMOverviewQABSettings(pageProxy, isS4);

    return QABSettings.generateChips();
}
