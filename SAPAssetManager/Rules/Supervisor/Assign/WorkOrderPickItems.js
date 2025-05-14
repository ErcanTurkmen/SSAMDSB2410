import libVal from '../../Common/Library/ValidationLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';

export default function WorkOrderPickerItems(context) {
    let queryOptions = "$filter=WOPartners/all(vw:vw/PartnerFunction ne 'VW')&$expand=WOPartners&$orderby=OrderId";

    try {
        const IsUnAssign = libCom.getStateVariable(context, 'IsUnAssign');
        const IsReAssign = libCom.getStateVariable(context, 'IsReAssign');
        
        if (IsUnAssign || IsReAssign) {
            queryOptions = `$filter=OrderId eq '${context.binding.OrderId}'`;
        }
    } catch (error) {
        Logger.error('WorkOrderPickerItems', error);
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', ['OrderId', 'OrderDescription', 'OrderType', 'DueDate'], libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOptions)).then(result => {
        let json = [];

        result.forEach(function(element) {
            json.push(
                {
                    'ObjectCell':
                    {
                        'PreserveIconStackSpacing': false,
                        'Title': `${element.OrderDescription}`,
                        'Subhead': `${element.OrderId} - ${element.OrderType}`,
                        'Footnote': libVal.evalIsEmpty(element.DueDate) ? context.localizeText('no_due_date') : context.formatDate(element.DueDate),
                    },
                    'ReturnValue': element.OrderId,
                });
        });
        const uniqueSet = new Set(json.map(item => JSON.stringify(item)));
        let finalResult = [...uniqueSet].map(item => JSON.parse(item));
        return finalResult;
    });
}
