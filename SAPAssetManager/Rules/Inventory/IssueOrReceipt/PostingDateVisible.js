import libCom from '../../Common/Library/CommonLibrary';

export default function PostingDateVisible(context) {
    let type = libCom.getStateVariable(context, 'IMObjectType');
    return ( type !== 'IB' && type !== 'OB');
}
