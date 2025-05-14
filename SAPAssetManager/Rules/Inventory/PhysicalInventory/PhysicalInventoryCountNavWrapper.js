import libCom from '../../Common/Library/CommonLibrary';

export const PI_NOT_COUNTED_FILTER = "EntryQuantity eq 0 and ZeroCount ne 'X'";
export const PI_COUNTED_FILTER = "EntryQuantity gt 0 or ZeroCount eq 'X'";

export default function PhysicalInventoryCountNavWrapper(context, customBinding) {
    let moveType = libCom.getStateVariable(context, 'IMMovementType');
    let binding = customBinding || context.binding;
    let actionBinding = context.getPageProxy().getActionBinding() || binding;
    let serial = !!(actionBinding.MaterialPlant_Nav && actionBinding.MaterialPlant_Nav.SerialNumberProfile);
    let counted = (actionBinding.EntryQuantity > 0 || actionBinding.ZeroCount === 'X');
    let posted = (!actionBinding['@sap.isLocal'] && counted);
    let editable = ((serial && posted) === false); //Item is serialized and already posted, so do not allow further counting

    libCom.setOnCreateUpdateFlag(context, '');
    if (editable) {
        if (moveType === 'C') {
            //Maintain list of items to traverse over during counting
            let item = actionBinding.Item;
            let selectList = 'Item,MaterialPlant_Nav/SerialNumberProfile';
            let orderBy = 'Item';
            let expand = 'MaterialPlant_Nav,PhysicalInventoryDocHeader_Nav';

            const sharedQueryItem = `Item ge '${item}' and `;
            const sharedQuery = `${sharedQueryItem} PhysInvDoc eq '${actionBinding.PhysInvDoc}' and FiscalYear eq '${actionBinding.FiscalYear}'`;

            const [NotCounted, Counted] =
                [
                    `${sharedQuery} and ${PI_NOT_COUNTED_FILTER}`,
                    `( ${sharedQuery} and ( ${PI_COUNTED_FILTER} ) and ((MaterialPlant_Nav/SerialNumberProfile ne '' and sap.islocal()) or (MaterialPlant_Nav/SerialNumberProfile eq '')))`, //Cannot edit posted serialized counts
                ];

            let baseQuery = `${NotCounted} or ${Counted}`;

            // find the page
            const pageName = libCom.getPageName(context);

            if (pageName === 'InboundOutboundListPage') {
                baseQuery = `${sharedQuery} and ${PI_NOT_COUNTED_FILTER}`;
            } else if (pageName === 'PhysicalInventoryItemsListPage') {
                const filters = context.getPageProxy().getControls()[0].filters;
                // find out currently active filter(s)
                if (filters && filters.length > 0) {
                    const filterItems = filters[0].filterItems;

                    // find an active filter
                    if (filterItems.length === 1) {
                        // one button pressed
                        baseQuery = filterItems[0] === PI_NOT_COUNTED_FILTER ? NotCounted : Counted;
                    }
                }
            }

            let query = `$select= ${selectList} &$filter= ${baseQuery} &$orderby= ${orderBy} &$expand= ${expand}`;

            return context.read('/SAPAssetManager/Services/AssetManager.service', 'PhysicalInventoryDocItems', [], query).then(function(results) {
                libCom.setStateVariable(context, 'PIDocumentItemsMap', results);
                return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCountUpdateNav.action');
            });
        }
    }
    return Promise.resolve(true);
}
