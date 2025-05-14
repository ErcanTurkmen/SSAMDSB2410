import ServiceOrderCategoryLinks from './ServiceOrderCategoryLinks';

export default function ServiceOrderDeleteLinks(context) {
    let links = ServiceOrderCategoryLinks(context);
    return links.delete;
}
