import {WCMBusinessPartnerWrapper} from './WCMBusinessPartnerWrapper';
import libEval from '../../Common/Library/ValidationLibrary';
export default function WCMBusinessPartnerName(context) {
    let wrapper = new WCMBusinessPartnerWrapper(context.getBindingObject());
    let name = wrapper.name();
    return libEval.evalIsEmpty(name) ? '-' : name;
}
