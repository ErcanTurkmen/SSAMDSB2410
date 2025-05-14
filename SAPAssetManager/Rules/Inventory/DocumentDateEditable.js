import libCom from '../Common/Library/CommonLibrary';

export default function DocumentDateEditable(context) {
    let objectType = libCom.getStateVariable(context, 'IMObjectType');
    return !(objectType === 'ADHOC' || objectType === 'REV');
}
