import libCom from '../../Common/Library/CommonLibrary';
import TimeSheetGetPersonnelNumber from './TimeSheetGetPersonnelNumber';

export default function TimeSheetCreateUpdateUpdateLinks(pageProxy) {

    let links = [];
    let woReadLink = libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:RecOrderLstPkr/#Value'));
    let opReadLink = libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:OperationLstPkr/#Value'));
    const subOpReadLink = libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:SubOperationLstPkr/#Value'));

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

    //Update Employee link
    const perNum = TimeSheetGetPersonnelNumber(pageProxy);
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
