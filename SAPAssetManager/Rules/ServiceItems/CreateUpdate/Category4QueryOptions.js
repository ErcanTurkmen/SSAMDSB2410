import CategoryQueryOptions from './CategoryQueryOptions';

export default function Category4QueryOptions(context) {
    let pageProxy = context.getPageProxy();
    return CategoryQueryOptions(pageProxy, '4');
}
