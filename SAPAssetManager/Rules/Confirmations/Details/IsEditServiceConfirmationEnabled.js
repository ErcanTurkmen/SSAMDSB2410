import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function IsEditServiceConfirmationEnabled(context) {
    if (context.binding) {
        return S4ServiceLibrary.isServiceObjectCompleted(context, context.binding, context.binding.MobileStatus_Nav).then(isCompleted => {
            return context.binding.CreatedBy === CommonLibrary.getSapUserName(context) && !isCompleted; 
        });  
    }

    return Promise.resolve(false);
}
