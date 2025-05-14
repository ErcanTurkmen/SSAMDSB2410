import {WCMBusinessPartnerWrapper} from './WCMBusinessPartnerWrapper';
import libEval from '../../Common/Library/ValidationLibrary';

export default function WCMBusinessPartnerAddress(context) {
    let wrapper = new WCMBusinessPartnerWrapper(context.getBindingObject());
    let address = wrapper.address();
    return libEval.evalIsEmpty(address) ? '-' : address;
}
