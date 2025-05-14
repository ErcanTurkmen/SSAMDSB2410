/**
* this function will redraw the object table 
* @param {IClientAPI} context
*/
export default function PhysicalInventoryItemsOnReturning(context) {
    let sectionedTableProxy = context.getControls()[0];

    // Setting the filters will redraw the FilterFeedbackBar.
    // Triggering section redraw with true param would force full redraw instead of row redraw.
    const currentFilters = sectionedTableProxy.filters;
    sectionedTableProxy.filters = currentFilters;

    const section = sectionedTableProxy.getSection('SectionObjectHeader0');
    if (section) {
        section.redraw(true);
    }

    let field = 'CountStatus';
    sectionedTableProxy.redraw().then(()=>{  
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$select=CountStatus').then(results => {
        if (results && results.length > 0) {
            context.binding[field] = results.getItem(0)[field];
        }
        try {                    
            context.getControl('SectionedTable').getSections()[0].redraw(true);
        } catch (err) {
            return false;
        }
        return true; 
    });
});
}


