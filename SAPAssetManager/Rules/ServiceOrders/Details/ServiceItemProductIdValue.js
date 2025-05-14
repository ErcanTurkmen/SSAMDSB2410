
export default function ServiceItemProductIdValue(context) {
    let id = context.binding.ProductID || '-';
    return context.localizeText('product_id_x', [id]);
}
