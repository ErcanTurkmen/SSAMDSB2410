
export default function S4RelatedHistoriesPendingEmptyCaption(context) {
    switch (context.getPageProxy().binding.RelatedEntity) {
        case 'S4ServiceOrder':
            return '$(L,no_pending_service_orders_available)';
        case 'S4ServiceRequest':
            return '$(L,no_pending_service_requests_available)';
        case 'S4ServiceConfirmation':
            return '$(L,no_pending_confirmations_available)';
        default:
            return '';
    }
}
