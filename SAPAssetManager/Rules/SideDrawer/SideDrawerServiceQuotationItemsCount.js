import Logger from '../Log/Logger';

export default async function SideDrawerServiceQuotationItemsCount(context) {
    try {
        const count = await context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceQuotationItems');
        return context.localizeText('service_quotation_items_x', [count]);
    } catch (error) {
        Logger.error('SideDrawerServiceQuotationItemsCount', error);
        return context.localizeText('service_quotation_items_x', [0]);
    }
}
