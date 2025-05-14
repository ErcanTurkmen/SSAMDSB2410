export default function NotificationCreateUpdateBreakdownValue(context) {
    //TODO Remove this once we get feedback from MDK (MDKBUG-368)
    return context.binding.BreakdownIndicator ? true : false;
}
