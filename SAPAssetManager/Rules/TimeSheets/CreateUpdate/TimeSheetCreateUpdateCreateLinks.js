import libCom from '../../Common/Library/CommonLibrary';
import TimeSheetGetPersonnelNumber from './TimeSheetGetPersonnelNumber';

export default function TimeSheetCreateUpdateCreateLinks(pageProxy, actionBinding) {
    let binding = pageProxy.getBindingObject();

    // change the binding if these are bulk confirmations
    let isBulkConfirmation;
    if (actionBinding) {
        isBulkConfirmation = true;
        binding = actionBinding;
    }

    let woReadLink = isBulkConfirmation ? binding.WOHeader['@odata.readLink'] :
        libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:RecOrderLstPkr/#Value'));
    let opReadLink = isBulkConfirmation ? binding.OperationReadlink :
        libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:OperationLstPkr/#Value'));
    const subOpReadLink = isBulkConfirmation ? binding.SubOperationReadLink :
        libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:SubOperationLstPkr/#Value'));

    let links = [];

    if (woReadLink && opReadLink) {
        links = [
            {
                'Property': 'MyWOHeader',
                'Target':
                {
                    'EntitySet': 'MyWorkOrderHeaders',
                    'ReadLink': woReadLink,
                },
            },
            {
                'Property': 'MyWOOperation',
                'Target':
                {
                    'EntitySet': 'MyWorkOrderOperations',
                    'ReadLink': opReadLink,
                },
            }];
    
        if (subOpReadLink) {
            links.push({
                'Property': 'MyWOSubOperation',
                'Target':
                {
                    'EntitySet': 'MyWorkOrderSubOperations',
                    'ReadLink': subOpReadLink,
                },
            });
        }
    }

    //Add Employee link
    const perNum = isBulkConfirmation ? binding.PersonnelNumber : TimeSheetGetPersonnelNumber(pageProxy);
    if (perNum) {
        links.push({
            'Property': 'Employee',
            'Target':
            {
                'EntitySet': 'Employees',
                'QueryOptions': `$filter=PersonnelNumber eq '${perNum}'`,
            },
        });
    }

    return links;
}
