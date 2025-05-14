import OnlineWorkOrderOperationsCount from './OnlineWorkOrderOperationsCount';

export default async function OnlineWorkOrderOperationListViewCaption(context) {
    const count = await OnlineWorkOrderOperationsCount(context);
    return context.localizeText('operations_x', [count]);
}
