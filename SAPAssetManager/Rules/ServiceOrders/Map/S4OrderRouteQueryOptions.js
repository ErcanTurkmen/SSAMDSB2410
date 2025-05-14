import S4MapQueryOptions from '../../Maps/S4MapQueryOptions';

export default function S4OrderRouteQueryOptions(context, extraFiltering) {
    let query = '$top=1';
    let options = S4MapQueryOptions(context, extraFiltering);

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceOrders', ['RequestedStart', 'ObjectID'], options).then(function(results) {
        let startDates = [];
        let ids = [];
        for (let i = 0; i < results.length; i++) {
            if (!startDates.includes(results.getItem(i).RequestedStart)) {
                startDates.push(results.getItem(i).RequestedStart);
                ids.push(results.getItem(i).ObjectID);
            }
        }

        if (ids.length > 0) {
            query = '$filter=';
            for (let j = 0; j < ids.length; j++) {
                if (j === 0) {
                    query = query + `ObjectID eq '${ids[j]}' `;
                } else {
                    query = query + ` or ObjectID eq '${ids[j]}' `;
                }
            }
        }
        
        return query;
    }).catch(() => {
        return query;
    });
}
