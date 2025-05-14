import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';
import libEval from '../Common/Library/ValidationLibrary';
import CommonLibrary from '../Common/Library/CommonLibrary';

export default function BusinessPartnerAddress(context) {
    let pageName = CommonLibrary.getPageName(context);

    if (pageName !== 'BusinessPartnerDetailsPage') {
        return '';
    }

    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let address = wrapper.address();
    return libEval.evalIsEmpty(address) ? '-' : address;
}
