import libCom from '../Common/Library/CommonLibrary';
import NoteCreateNav from '../Notes/NoteCreateNav';
import IsBusinessPartnerAddOptionsVisibile from './IsBusinessPartnerAddOptionsVisibile';

export default function BusinessPartnerCreateNoteOnPress(context) {
    const businessPartner = context.binding?.BusinessPartner_Nav;
    const pageProxy = context.getPageProxy();
    pageProxy.setActionBinding(businessPartner);

    return NoteCreateNav(context, businessPartner).then(() => {
        if (libCom.getPageName(pageProxy) === 'BusinessPartnerDetailsPage') {
            return IsBusinessPartnerAddOptionsVisibile(context).then(visible => {
                pageProxy.setActionBarItemVisible('Add', visible);
            });
        }

        return true;
    });
}
