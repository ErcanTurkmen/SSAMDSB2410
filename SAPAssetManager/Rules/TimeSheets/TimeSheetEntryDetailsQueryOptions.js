import libCrew from '../Crew/CrewLibrary';

export default function TimeSheetEntryDetailsQueryOptions(context) {
    if (libCrew.isCrewFeatureEnabled(context)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/CrewList', [], '').then(function(result) {
            return `$filter=PersonnelNumber eq '${context.binding.CrewItemKey}' and Date eq datetime'${result.getItem(0).OriginTimeStamp}'&$expand=MyWOHeader,MyWOOperation,MyWOSubOperation,Employee`;
        });
    } else {
      return `$filter=Date eq datetime'${context.binding.Date}'&$expand=MyWOHeader,MyWOOperation,MyWOSubOperation,Employee&$orderby=Counter asc`;
    }
}
