import S4ServiceLibrary from './S4ServiceLibrary';

export default function ServiceOrderIsNotCompleted(context) {
    let binding = context.binding || {};
    return S4ServiceLibrary.isServiceObjectCompleted(context, binding).then(isCompleted => {
        return !isCompleted;
    });
}
