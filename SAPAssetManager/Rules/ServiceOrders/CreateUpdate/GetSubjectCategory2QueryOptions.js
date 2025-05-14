import CategoryQueryOptions from '../../ServiceItems/CreateUpdate/CategoryQueryOptions';

export default function GetSubjectCategory2QueryOptions(context) {
    let pageProxy = context.getPageProxy();
    return CategoryQueryOptions(pageProxy, '2', 'SubjectCategory');
}
