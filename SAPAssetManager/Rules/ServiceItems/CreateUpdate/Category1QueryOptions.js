import CategoryQueryOptions from './CategoryQueryOptions';

export default function Category1QueryOptions(context) {
    let pageProxy = context.getPageProxy();
    return CategoryQueryOptions(pageProxy, '1');
}
