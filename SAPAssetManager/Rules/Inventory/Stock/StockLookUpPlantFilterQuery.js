
export default function StockLookUpPlantFilterQuery(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialSLocs', ['Plant'], '$orderby=Plant')
        .then((/** @type {ObservableArray<MaterialSLoc>} */ slocs) => [...new Set(slocs.map((/** @type {MaterialSLoc} */ sloc) => sloc.Plant)).values()].map(p => `Plant eq '${p}'`))
        .then(plantTerms => plantTerms.length ? `$filter=${plantTerms.join(' or ')}` : '');
}
