import CategoryQueryOptions from './CategoryQueryOptions';

export default function Category3QueryOptions(context) {
    let pageProxy = context.getPageProxy();
    return CategoryQueryOptions(pageProxy, '3');
}
