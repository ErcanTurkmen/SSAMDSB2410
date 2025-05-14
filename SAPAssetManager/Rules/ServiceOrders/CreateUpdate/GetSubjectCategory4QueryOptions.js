import CategoryQueryOptions from '../../ServiceItems/CreateUpdate/CategoryQueryOptions';

export default function GetSubjectCategory4QueryOptions(context) {
    let pageProxy = context.getPageProxy();
    return CategoryQueryOptions(pageProxy, '4', 'SubjectCategory');
}
