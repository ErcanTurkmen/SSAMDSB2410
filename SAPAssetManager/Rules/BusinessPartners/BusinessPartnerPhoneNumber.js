import IsAddressCommType from './IsAddressCommType';
import { BusinessPartnerWrapper } from './BusinessPartnerWrapper';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import libCom from '../Common/Library/CommonLibrary';


/**
 * Retrieves either the Telephone number or Mobile number if available. Telephone preferred
 * @param {Context} context - calling context
 */
export default function BusinessPartnerPhoneNumber(context, isCallable=false) {
    let pageName = libCom.getPageName(context);

    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let teleType = (IsAddressCommType(context) && isCallable) ? 'CallableTelephone' : 'Telephone';
    let phoneNumber = wrapper.communicationProperty(teleType);
        
    if (ValidationLibrary.evalIsEmpty(phoneNumber)) {
        phoneNumber = wrapper.communicationProperty('Mobile');
    }

    if (ValidationLibrary.evalIsEmpty(phoneNumber)) {
        phoneNumber = wrapper.communicationProperty('TelNumber');
    }

    let emptyVal = pageName === 'BusinessPartnerDetailsPage' ? '-' : '';
    return ValidationLibrary.evalIsEmpty(phoneNumber) ? emptyVal : phoneNumber;       
}
