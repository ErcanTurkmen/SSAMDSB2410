export class PartnerLibrary {

    static getCreateUpdateLink(pageProxy) {
        let links = [];

        let woLink = pageProxy.createLinkSpecifierProxy(
            'WorkOrderHeader', 
            'MyWorkOrderHeaders', 
            '',
            'pending_1',
        );
        links.push(woLink.getSpecifier());

        return links;
    }
}
