import CategoryQueryOptions from '../../ServiceItems/CreateUpdate/CategoryQueryOptions';

export default function GetSubjectCategory1QueryOptions(context) {
    let pageProxy = context.getPageProxy();
    return CategoryQueryOptions(pageProxy, '1', 'SubjectCategory');
}
