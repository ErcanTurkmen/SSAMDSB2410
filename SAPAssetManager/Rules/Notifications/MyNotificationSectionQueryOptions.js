import common from '../Common/Library/CommonLibrary';

export default function MyNotificationSectionQueryOptions(context) {
    let userName = common.getSapUserName(context);
    const started = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue();
    let queryBuilder = context.dataQueryBuilder();
    let filter = `(ReportedBy eq '${userName}') or (NotifMobileStatus_Nav/MobileStatus eq '${started}')`;
    queryBuilder.filter(filter);
    queryBuilder.orderBy('CreationDate');
    queryBuilder.expand('NotifMobileStatus_Nav, NotifMobileStatus_Nav/OverallStatusCfg_Nav');
    queryBuilder.top(50);
    return queryBuilder;
}
