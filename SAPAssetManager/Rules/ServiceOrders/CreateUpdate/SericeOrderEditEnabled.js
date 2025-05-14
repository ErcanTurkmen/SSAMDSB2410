import S4ServiceLibrary from '../S4ServiceLibrary';

export default function SericeOrderEditEnabled(context, binding = context.binding) {
    return S4ServiceLibrary.isServiceObjectCompleted(context, binding).then(isCompleted => {
        return !isCompleted;
    });
}
