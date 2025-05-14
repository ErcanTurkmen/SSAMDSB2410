import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';

export default function NotCompletedServiceConfirmationsQueryOptions() {
    let query = '$orderby=ObjectID';
    let confirmations = ServiceConfirmationLibrary.getInstance().getRelatedConfirmations();
    let filters = [];

    confirmations.forEach(id => {
        filters.push(`ObjectID eq '${id}'`);
    });

    if (filters.length) {
        //concatenates all elements of the filters array into a string
        //or used to filter by object id
        query += '&$filter=' + filters.join(' or ');
    }

    return query;
}
