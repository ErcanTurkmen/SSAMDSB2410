import { NotificationTaskChangeStatusOptions } from '../Details/NotificationTaskDetailsNav';

export default async function NotificationTaskCardSecondaryAndPrimaryActionOnPress(context) {
    const pageProxy = context.getPageProxy();
    const options = await NotificationTaskChangeStatusOptions(pageProxy, pageProxy.getActionBinding());

    return pageProxy.executeAction(options[0].OnPress);
}
