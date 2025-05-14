
/**
 *  @param {{binding: S4ServiceOrder} & IPageProxy} context
 * @returns {Promise<S4ServiceConfirmation[]>} */
export default function ConfirmationsSectionValues(context) {
    const toExpand = [
        'S4ServiceConfirmation_Nav',
        'S4ServiceConfirmation_Nav/ServiceConfirmationItems_Nav',
        'S4ServiceConfirmation_Nav/MobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav',
        'S4ServiceConfirmation_Nav/RefObjects_Nav/MyEquipment_Nav',
        'S4ServiceConfirmation_Nav/RefObjects_Nav/MyFunctionalLocation_Nav',
        'S4ServiceConfirmation_Nav/RefObjects_Nav/Material_Nav',
        'S4ServiceConfirmation_Nav/Partners_Nav',
        'S4ServiceConfirmation_Nav/OrderTransHistory_Nav',
        'S4ServiceConfirmation_Nav/Document',
    ].join(',');
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/S4ServiceConfirmationTranHistory_Nav`, [], `$expand=${toExpand}&$filter=sap.entityexists(S4ServiceConfirmation_Nav)&$top=2`)
        .then(result => Array.from(result, i => i.S4ServiceConfirmation_Nav));
}
