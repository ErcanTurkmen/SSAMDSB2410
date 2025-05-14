import { NotificationTaskChangeStatusOptions } from '../Details/NotificationTaskDetailsNav';

export default async function NotificationTaskCardSecondaryAndPrimaryActionTitle(context) {
    const options = await NotificationTaskChangeStatusOptions(context, context.binding);

    return options[0].Title;
}
