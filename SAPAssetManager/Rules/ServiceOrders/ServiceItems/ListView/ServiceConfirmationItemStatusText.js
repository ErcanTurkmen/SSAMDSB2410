
export default function ServiceConfirmationItemStatusText(context) {
    if (context.bidning && context.bidning.ItemCategory_Nav) {
        return context.bidning.ItemCategory_Nav.Description;
    }

    return '';
}
