/**
* Query Option for Notificaiton Edit on Map
* @param {IClientAPI} clientAPI
*/
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import QueryBuilder from '../../Common/Query/QueryBuilder';
import phaseModelExpand from '../../PhaseModel/PhaseModelListViewQueryOptionExpand';

export default function NotificationEditFromMapNavQueryOptions(context) {
    let querBuilder = new QueryBuilder();
   
    querBuilder.addFilter(`NotificationNumber eq '${context.binding.NotificationNumber}'`);
   
    querBuilder.addExpandStatement('NotifPriority');
  
    if (IsPhaseModelEnabled(context)) {
        querBuilder.addExpandStatement(phaseModelExpand('QMI'));
    }
   
    return querBuilder.build();
}
