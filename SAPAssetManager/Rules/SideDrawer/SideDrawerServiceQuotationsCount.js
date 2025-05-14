import Logger from '../Log/Logger';

export default async function SideDrawerServiceQuotationsCount(context) {
    try {
        const count = await context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceQuotations');
        return context.localizeText('service_quotations_x', [count]);
    } catch (error) {
        Logger.error('SideDrawerServiceQuotationsCount', error);
        return context.localizeText('service_quotations_x', [0]);
    }
}
