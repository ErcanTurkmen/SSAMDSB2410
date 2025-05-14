
export default function WCMSystemStatusFilterPropertyItems(context) {
    const query = ['I0098', 'I0175', 'I0611', 'I0642', 'I0046'].map(code => `(SystemStatus eq '${code}')`).join(' or ');
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'SystemStatuses', [], `$filter=${query}&$select=StatusText,SystemStatus`).then(results => {
        return {
            name: 'ActualSystemStatus', 
            values: Array.from(results, r => ({
                ReturnValue: r.SystemStatus,
                DisplayValue: r.StatusText,
            })),
        };
    });
}
