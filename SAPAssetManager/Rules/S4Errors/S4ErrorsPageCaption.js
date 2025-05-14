import S4ErrorsLibrary from './S4ErrorsLibrary';

export default function S4ErrorsPageCaption(clientApi) {
    const count = S4ErrorsLibrary.countS4ObjectErrorsFromBinding(clientApi);
    return clientApi.localizeText('errors_x', [count]);
}
