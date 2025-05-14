import libCom from '../../Common/Library/CommonLibrary';

export default function IsNumberOfLabelsEditable(context) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    return objectType !== 'REV';
}
