import Logger from '../../Log/Logger';
import libSuper from '../../Supervisor/SupervisorLibrary';

export default function UserRolesFilterListPickerItems(context) {
    const supervisorAssignmentModel = libSuper.getSupervisorAssignmentModel(context);

    let filter = '';
    if (supervisorAssignmentModel === 'O') {
        filter = "$filter=OrgId eq '" + libSuper.getSupervisorOrgId() + "'";
    } else {
        filter = "$filter=ExternalWorkCenterId eq '" + libSuper.getSupervisorWorkCenter() + "'";
    }

    const query = filter + '&$orderby=SAPUserId,UserNameShort';
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserRoles', ['SAPUserId','UserNameLong','PersonnelNo'], query)
        .then(result => {
            const unassignedPickerItem = {
                'DisplayValue': context.localizeText('unassigned'),
                'ReturnValue': '00000000',
            };

            let json = [unassignedPickerItem];
            result.forEach((element) => {
                json.push({
                    'DisplayValue': `${element.SAPUserId} - ${element.UserNameLong}`,
                    'ReturnValue': element.PersonnelNo,
                });
            });
            const uniqueSet = new Set(json.map(item => JSON.stringify(item)));
            let finalResult = [...uniqueSet].map(item => JSON.parse(item));
            return finalResult;
        })
        .catch((error) => {
            Logger.error('UserRolesFilterListPickerItems', error);
            return [];
        });
}
