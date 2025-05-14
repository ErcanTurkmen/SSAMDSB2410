import libCom from '../../Common/Library/CommonLibrary';

/**
 * Count of smartforms associated with this operation or service item
 * @param {*} sectionProxy 
 * @param {*} queryOptions 
 * @returns 
 */
export default function OperationFormInstancesCount(sectionProxy, queryOptions='') {
    let binding = (sectionProxy.getPageProxy ? sectionProxy.getPageProxy().binding : sectionProxy.binding);
    let s4 = false;

	if (sectionProxy.constructor.name === 'SectionedTableProxy') {
        binding = sectionProxy.getPageProxy().getExecutedContextMenuItem().getBinding();
    }
    if (binding['@odata.type'] ==='#sap_mobile.S4ServiceItem') {
        s4 = true;
    }
    if (!queryOptions) {
        if (s4) {
            queryOptions = "$filter=S4ServiceOrderId eq '" + binding.ObjectID + "' and S4ServiceItemNumber eq '" + binding.ItemNo + "'";
        } else {
            queryOptions = "$filter=WorkOrder eq '" + binding.OrderId + "' and Operation eq '" + binding.OperationNo + "'";
        }
    }
    return libCom.getEntitySetCount(sectionProxy, 'FSMFormInstances', queryOptions);
}
