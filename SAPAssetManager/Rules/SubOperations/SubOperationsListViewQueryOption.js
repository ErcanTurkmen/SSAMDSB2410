import CommonLibrary from '../Common/Library/CommonLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import ModifyListViewSearchCriteria from '../LCNC/ModifyListViewSearchCriteria';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import WorkOrderSubOperationListViewCaption from '../WorkOrders/SubOperations/CreateUpdate/WorkOrderSubOperationListViewCaption';

/** @param {IPageProxy | ISectionedTableProxy} context  */
export default function SubOperationsListViewQueryOption(context) {
	const currentPageName = CommonLibrary.getPageName(context);
	if (currentPageName === 'SubOperationsListViewPage') {
		WorkOrderSubOperationListViewCaption(context.getPageProxy());
	}
	const toExpand = [
		'SubOpMobileStatus_Nav',
		'SubOpMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav',
		'SubOpMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav',
		'SubOperationLongText',
		'WorkOrderOperation',
		'WorkOrderOperation/OperationMobileStatus_Nav',
		'WorkOrderOperation/WOHeader',
		'WorkOrderOperation/WOHeader/OrderMobileStatus_Nav,WorkOrderOperation/WOHeader/UserTimeEntry_Nav',
		'WorkOrderOperation/WOHeader/WOPriority',
		'WorkOrderOperation/UserTimeEntry_Nav',
	];
	const orderby = [
		'OrderId',
		'OperationNo',
		'SubOperationNo',
	];
	const searchString = (context.searchString || '').toLowerCase();
	const filterTerms = [getSearchQueryTerm(context, searchString)].filter(i => !!i);

	if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
		if ((searchString !== '') && (searchString === context.localizeText('clocked_in_lowercase'))) {
			return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserTimeEntries', ['PreferenceGroup', 'OrderId', 'OperationNo', 'WOHeader_Nav/ObjectKey', 'WOOperation_Nav/ObjectKey'], '$orderby=PreferenceValue desc&$top=1&$expand=WOHeader_Nav,WOOperation_Nav')
				.then((/** @type {ObservableArray<UserTimeEntry>} */ userTimeEntries) => {
					if (!ValidationLibrary.evalIsEmpty(userTimeEntries) && userTimeEntries.getItem(0).PreferenceGroup === 'CLOCK_IN') {
						return `$filter=OrderId eq '${userTimeEntries.getItem(0).OrderId}'&$expand=UserTimeEntry_Nav`;
					}
					return '';
				}).catch(() => {
					return ''; //Read failure so return a blank string
				});
		}
		toExpand.push('WorkOrderOperation/WOHeader/OrderISULinks', 'WorkOrderOperation/WOHeader/DisconnectActivity_Nav');
	}
	return createQueryOptions(toExpand, filterTerms, orderby);
}

function createQueryOptions(toExpand, filterTerms, orderby) {
	return [
		toExpand.length ? `$expand=${toExpand.join(',')}` : '',
		filterTerms.length ? `$filter=${filterTerms.join(' and ')}` : '',
		orderby.length ? `$orderby=${orderby.join(',')}` : '',
	].filter(i => !!i).join('&');
}

function getSearchQueryTerm(context, searchString) {
	if (searchString === '') {
		return '';
	}
	const searchByProperties = ['OperationShortText', 'OperationNo', 'SubOperationNo', 'OrderId'];
	ModifyListViewSearchCriteria(context, 'MyWorkOrderSubOperation', searchByProperties);
	return CommonLibrary.combineSearchQuery(searchString, searchByProperties);
}
