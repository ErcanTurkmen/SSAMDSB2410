import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WOPhaseControlCodesQueryOptions(context) {
    let query = `$orderby=PhaseControl&$filter=Entity eq '${CommonLibrary.getAppParam(context, 'OBJECTTYPE', 'WorkOrder')}'`;
    return query;
}
