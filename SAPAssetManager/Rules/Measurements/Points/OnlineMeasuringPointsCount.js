export default function OnlineMeasuringPointsCount(clientAPI) {
    const binding = clientAPI.getPageProxy().binding;
    const filter = binding.EquipId ? `$filter=EquipId eq '${binding.EquipId}'` : `$filter=FuncLocIdIntern eq '${binding.FuncLocIdIntern}'`;
    return clientAPI.count('/SAPAssetManager/Services/OnlineAssetManager.service', 'MeasuringPoints', filter);    
}
