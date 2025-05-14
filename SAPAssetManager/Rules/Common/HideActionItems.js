
export default function HideActionItems(context, count = 1) {
    for (let i = 0; i < count; i++) {
        context.setActionBarItemVisible(i, false);
    }
}
