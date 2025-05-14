export default function ServiceConfirmationsCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceConfirmations')
        .then(count => {
            return context.formatNumber(count,'',{minimumFractionDigits : 0});
        }).catch(() => {
            return context.formatNumber(0,'',{minimumFractionDigits : 0});
        });
}
