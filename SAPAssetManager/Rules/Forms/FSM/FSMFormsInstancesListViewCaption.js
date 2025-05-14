import libCom from '../../Common/Library/CommonLibrary';
import libForms from './FSMSmartFormsLibrary';

/**
 * Display the smart forms caption count on the list, supporting main list and operations/service items list plus mdk filters
 * @param {*} context 
 * @returns 
 */
export default function FSMFormsInstanceListViewCaption(context) {

    let mdkFilter = libCom.getQueryOptionFromFilter(context);
    let totalQueryOption, queryOption;
    let params = [];
    const binding = context.binding;

    if (libCom.isDefined(binding) &&
        ((libCom.isDefined(binding.OperationNo) && libCom.isDefined(binding.OrderId)) ||
            (libCom.isDefined(binding.ObjectID) && libCom.isDefined(binding.ItemNo)))) {
        totalQueryOption = libForms.getOperationFSMFormsQueryOptions(context, false);
        queryOption = libForms.getOperationFSMFormsQueryOptions(context, false);
    } else {
        totalQueryOption = libForms.getFSMFormsQueryOptions(context, false);
        queryOption = libForms.getFSMFormsQueryOptions(context, false);
    }

    if (mdkFilter) { //Combine mdk filter with standard smart form query options
        queryOption = queryOption.replace('$filter=', '');
        queryOption = mdkFilter + ' and ' + queryOption;
    }

    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'FSMFormInstances', totalQueryOption);
    let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'FSMFormInstances', queryOption);

    return Promise.all([totalCountPromise, countPromise]).then(function(counts) {
        let totalCount = counts[0];
        let count = counts[1];
        params.push(count);
        params.push(totalCount);
        if (count === totalCount) {
            return context.setCaption(context.localizeText('smart_forms_x', [totalCount]));
        }
        return context.setCaption(context.localizeText('smart_forms_x_x', params));
    });
}
