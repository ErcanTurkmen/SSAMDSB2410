import woHistReadLink from './WorkOrderHistoryReadLink';

export default function WorkOrderRelatedHistoryCaption(context) {
   let historyReadLinkPath = woHistReadLink(context);
   return context.count('/SAPAssetManager/Services/AssetManager.service', historyReadLinkPath, "$filter=ReferenceType eq 'P' or ReferenceType eq 'H'").then(count => {
        if (count) {
            let params=[count];
            return context.localizeText('related_work_orders_dynamic',params);
        } else {
            return context.localizeText('no_related_work_orders');
        }
    });
}
