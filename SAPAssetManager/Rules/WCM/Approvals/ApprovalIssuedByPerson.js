import ApprovalInfoFormat from './ApprovalInfoFormat';

export default function ApprovalIssuedByPerson(context) {
    return ApprovalInfoFormat(context, 'IssuedBy');
}
