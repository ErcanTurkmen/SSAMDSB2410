import libCom from '../../Common/Library/CommonLibrary';

export default function NumberOfLabelsIsVisible(context) {
    const type = libCom.getStateVariable(context, 'IMObjectType');
    const move = libCom.getStateVariable(context, 'IMMovementType');

    return (((type === 'ADHOC' || type === 'STO' || type === 'PRD' || type === 'PO' || type === 'RES') && (move === 'I' || move === 'R')) || (type === 'REV'));
}
