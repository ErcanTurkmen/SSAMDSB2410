import common from '../../../Common/Library/CommonLibrary';

export default function PhaseControlCodesQueryOptions(context) {
    let query = `$orderby=PhaseControl&$filter=Entity eq '${common.getAppParam(context, 'OBJECTTYPE','Operation')}'`;
    return query;
}
