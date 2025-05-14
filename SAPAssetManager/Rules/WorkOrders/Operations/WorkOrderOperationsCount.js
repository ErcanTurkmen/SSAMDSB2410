import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WorkOrderOperationsCount(sectionProxy, queryOptions='') {
    const pageProxy = sectionProxy.getPageProxy?.();
    let binding = pageProxy.binding || sectionProxy.binding;
	if (sectionProxy.constructor.name === 'SectionedTableProxy') {
        binding = CommonLibrary.getBindingObject(sectionProxy);
    }
    if (!binding && pageProxy.getActionBinding()) {
        binding = pageProxy.getActionBinding();
    }
    let readLink = binding['@odata.readLink'];
    return CommonLibrary.getEntitySetCount(sectionProxy, readLink + '/Operations', queryOptions);
}
