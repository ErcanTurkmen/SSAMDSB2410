import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function CategorizationCaption(clientAPI) {
    return S4ServiceLibrary.isViewModeTravelExpence(clientAPI) ? '' : clientAPI.localizeText('categorization');
}
