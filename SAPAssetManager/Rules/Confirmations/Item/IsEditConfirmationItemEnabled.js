import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function IsEditConfirmationItemEnabled(context) {
    return S4ServiceLibrary.isServiceObjectCompleted(context, context.binding, context.binding.MobileStatus_Nav).then(isCompleted => {
        return !isCompleted;
    });
}
