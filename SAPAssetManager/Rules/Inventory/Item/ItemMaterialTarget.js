export default function ItemMaterialTarget(context) {
    const item = context.getPageProxy().getClientData().item || context.binding.item;

    return item.MaterialDocItem_Nav;
}
