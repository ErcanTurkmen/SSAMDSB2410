import WorkOrderHistoriesCount from '../../WorkOrders/History/WorkOrderHistoriesCount';

export default async function RelatedWorkOrdersFooterVisible(clientAPI) {
    return WorkOrderHistoriesCount(clientAPI).then(count => {
        return count > 2;
    });
}
