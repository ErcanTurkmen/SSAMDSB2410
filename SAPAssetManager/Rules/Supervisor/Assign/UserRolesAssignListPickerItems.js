import libSuper from '../SupervisorLibrary';

export default function UserRolesAssignListPickerItems(context) {

    let type = libSuper.getSupervisorAssignmentModel(context);
    let filter = '';
    
    if (type && type === 'O') {
        filter = "$filter=OrgId eq '" + libSuper.getSupervisorOrgId() + "'";
    } else {
        filter = "$filter=ExternalWorkCenterId eq '" + libSuper.getSupervisorWorkCenter() + "'";
    }
    filter += " and PersonnelNo ne '00000000'"; //User does not have an HR employee, so cannot be assigned to
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserRoles', ['SAPUserId','UserNameLong','PersonnelNo'], filter + '&$orderby=SAPUserId,UserNameShort').then(result => {
        let json = [];
        result.forEach(function(element) {
            json.push(
                {
                    'DisplayValue': `${element.SAPUserId} - ${element.UserNameLong}`,
                    'ReturnValue': element.PersonnelNo,
                });
        });
        const uniqueSet = new Set(json.map(item => JSON.stringify(item)));
        let finalResult = [...uniqueSet].map(item => JSON.parse(item));
        return finalResult;
    });
}
