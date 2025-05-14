import CategoryQueryOptions from '../../ServiceItems/CreateUpdate/CategoryQueryOptions';

export default function GetSubjectCategory3QueryOptions(context) {
    let pageProxy = context.getPageProxy();
    return CategoryQueryOptions(pageProxy, '3', 'SubjectCategory');
}
