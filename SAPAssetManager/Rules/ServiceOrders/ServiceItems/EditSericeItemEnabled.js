import S4ServiceLibrary from '../S4ServiceLibrary';

export default function EditSericeItemEnabled(context) {
    return S4ServiceLibrary.isServiceObjectCompleted(context, context.binding, context.binding.MobileStatus_Nav).then(isCompleted => {
        return !isCompleted;
    });
}
