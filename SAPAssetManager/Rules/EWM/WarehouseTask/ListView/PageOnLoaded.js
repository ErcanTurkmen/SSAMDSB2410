import { SaveTasksToPageData } from '../Details/TaskArray';

/**
 * Save the Tasks of the Warehouse Order
 * @param {IPageProxy} pageProxy 
 */
export default function PageOnLoaded(pageProxy) {
    SaveTasksToPageData(pageProxy);
}
