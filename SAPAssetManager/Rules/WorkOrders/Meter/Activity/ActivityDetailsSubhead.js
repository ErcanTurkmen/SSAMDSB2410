import MeterSectionLibrary from '../../../Meter/Common/MeterSectionLibrary';
/*
To return the status and description, we need to read the ActivityStatus from the DisconnectionActivities based on work order and
then look up into DisconnectActivityStatuses entity.
*/

export default function ActivityDetailsSubhead(context) {
    const woBinding = MeterSectionLibrary.getWorkOrderBinding(context);

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'DisconnectionActivities', [], `$filter=OrderId eq '${woBinding.OrderId}'&$select=ActivityStatus`).then(result => {
        if (result && result.length > 0) {
            let ActivityStatus = result.getItem(0).ActivityStatus;
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'DisconnectActivityStatuses', [], `$filter=Status eq '${ActivityStatus}'`).then(value => {
                if (value && value.length > 0) {
                    return `${value.getItem(0).Status} - ${value.getItem(0).Description}`;
                } else {
                    return '-';
                }
            });
        }
        return '-';
    });
}
