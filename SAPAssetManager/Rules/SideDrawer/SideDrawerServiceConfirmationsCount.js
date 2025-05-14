
export default function SideDrawerServiceConfirmationsCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceConfirmations')
        .then(count => {
            return context.localizeText('confirmations_count', [count]);
        })
        .catch(() => {
            return context.localizeText('confirmations_count', [0]);
        });
}
