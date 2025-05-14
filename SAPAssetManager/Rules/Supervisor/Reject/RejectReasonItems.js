
export default function RejectReasonItems(context) {
    let items = [];
    let pageProxy = context.getPageProxy();
    if (pageProxy && pageProxy.binding && pageProxy.binding['@odata.type'].includes('S4')) {
        return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'S4RejectionReasons', [], '$orderby=RejectionReason').then(function(result) {
            if (result.length) {
                result.forEach(reason => {
                    items.push({
                        'DisplayValue': reason.Description,
                        'ReturnValue': reason.RejectionReason,
                    });
                });
            }
            return items;
        });
    } else {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'RejectionReasons', [], '$orderby=ReasonDescription').then(function(result) {
            if (result.length) {
                result.forEach(reason => {
                    items.push({
                        'DisplayValue': reason.ReasonDescription,
                        'ReturnValue': reason.ReasonCode,
                    });
                });
            }
            return items;
        });
    }
}
