import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Setting required label on form items based on Travel Expence mode
* @param {IClientAPI} clientAPI
*/
export default function GetSITravelExpenceRequiredLabel(formCellProxy) {
    const name = formCellProxy.getName();
    const requiredLabel = S4ServiceLibrary.isViewModeTravelExpence(formCellProxy) ? '*' : '';
    switch (name) {
        case 'ServiceContractLstPkr':
            return `${formCellProxy.localizeText('service_contract')}${
                S4ServiceLibrary.getServiceContractItemRequiredFromAppParam(formCellProxy)
                || S4ServiceLibrary.getServiceContractRequiredFromAppParam(formCellProxy)
                ? '*'
                : ''
            }`;
        case 'AmountProperty':
            return `${formCellProxy.localizeText('amount')}${requiredLabel}`;
        case 'CurrencyLstPkr':
            return `${formCellProxy.localizeText('currency')}${requiredLabel}`;
        default:
            return '';
    }
}
