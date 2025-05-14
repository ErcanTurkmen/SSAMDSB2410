
export default function S4RelatedHistoriesRecentEmptyCaption(context) {
    switch (context.getPageProxy().binding.RelatedEntity) {
        case 'S4ServiceOrder':
            return '$(L,no_previous_service_orders_available)';
        case 'S4ServiceRequest':
            return '$(L,no_previous_service_requests_available)';
        case 'S4ServiceConfirmation':
            return '$(L,no_previous_confirmations_available)';
        default:
            return '';
    }
}
