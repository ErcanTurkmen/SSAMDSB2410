import libCom from '../Common/Library/CommonLibrary';
import IsOnlineFunctionalLocation from '../FunctionalLocation/IsOnlineFunctionalLocation';
import Logger from '../Log/Logger';
import { IsBindingObjectOnline } from '../WorkOrders/IsBindingObjectOnline';

export default async function OnlineBusinessPartnersTarget(context) {
    try {
        context.showActivityIndicator();

        let partnerLink = 'Partner';
        if (IsOnlineFunctionalLocation(context)) {
            partnerLink = 'FuncLocPartner';
        } else if (IsBindingObjectOnline(context)) {
            partnerLink = 'Partners';
        }
        let partners = await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', `${context.getPageProxy().binding['@odata.readLink']}/${partnerLink}`, [], '');
        if (libCom.isDefined(partners)) {
            let result = [];
            for (let i = 0; i < partners.length; i++) {
                const partner = partners.getItem(i);
                if (partner.AddressNum) {
                    const address = await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', `Addresses('${partner.AddressNum}')`, [], '$expand=Communication');
                    partner.Address = address?.getItem(0);
                }
                result.push(partner);
            }
            return result;
        }
        return [];
    } catch (err) {
        Logger.error('OnlineBusinessPartnersTarget', err);
        return [];
    } finally {
        context.dismissActivityIndicator();
    }
}
