import SubServiceItemByItemCount from './SubServiceItemByItemCount';

export default async function IsSubServiceItemFooterVisible(context) {
    const count = await SubServiceItemByItemCount(context);
    return count > 1;
}
