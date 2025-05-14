export default function TimeSheetEntryCreateUpdateRecOrderUpdate(context) {
    const binding = context.binding;
    if (binding.OrderId) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${binding.OrderId}')`, '').then(count => {
            if (count === 0) {
                return null;
            }
            return `MyWorkOrderHeaders('${binding.OrderId}')`;
        });
    }
    return null;
}
