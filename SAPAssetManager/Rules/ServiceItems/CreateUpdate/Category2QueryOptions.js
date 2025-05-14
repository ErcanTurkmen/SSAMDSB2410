import CategoryQueryOptions from './CategoryQueryOptions';

export default function Category2QueryOptions(context) {
    let pageProxy = context.getPageProxy();
    return CategoryQueryOptions(pageProxy, '2');
}
