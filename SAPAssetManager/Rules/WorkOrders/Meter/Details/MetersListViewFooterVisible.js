import WorkOrderMetersCount from './WorkOrderMetersCount';

/**
* Disable footer it items count is lower than 2
* @param {IClientAPI} clientAPI
*/
export default async function MetersListViewFooterVisible(clientAPI) {
    const num = await WorkOrderMetersCount(clientAPI);
    return Number(num) ? Number(num) >= 2 : true;
}
