
export default function SetServiceOrderWarrantyIDValue(context) {
    if (context.binding && context.binding.S4ServiceOrder_Nav && context.binding.S4ServiceOrder_Nav.WarrantyDesc) {
        return context.binding.S4ServiceOrder_Nav.WarrantyDesc;
    } else if (context.binding && context.binding.WarrantyDesc) {
        return context.binding.WarrantyDesc;
    }

    return '';
}
