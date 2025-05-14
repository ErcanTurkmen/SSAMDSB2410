import commonLibrary from '../Common/Library/CommonLibrary';

export default function MobileStatusEAMObjectType(context) {
    let mobileStatusEAMObjectType = '';
    let binding;
    if (!context['@odata.type']) {
        binding = commonLibrary.getBindingObject(context);
    }
    let condition = binding ? binding : context;
    if (condition) {
        switch (condition['@odata.type']) {
            case '#sap_mobile.MyWorkOrderHeader':
                mobileStatusEAMObjectType = 'WORKORDER';
                break;
            case '#sap_mobile.MyWorkOrderOperation': 
            case '#sap_mobile.MyWorkOrderSubOperation':
                mobileStatusEAMObjectType = 'WO_OPERATION';
                break;
            case '#sap_mobile.MyNotificationTask':
            case '#sap_mobile.MyNotificationItemTask':
                mobileStatusEAMObjectType = 'TASK';
                break;
            case '#sap_mobile.MyNotificationHeader':
                mobileStatusEAMObjectType = 'NOTIFICATION';
                break;
            default:
                break;
        }
    }

    if (!mobileStatusEAMObjectType && condition && condition.selectedOperations) {
        mobileStatusEAMObjectType = 'WO_OPERATION';
    }

    return mobileStatusEAMObjectType;
}
