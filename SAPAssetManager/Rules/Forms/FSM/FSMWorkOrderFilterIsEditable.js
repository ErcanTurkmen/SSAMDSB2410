import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function FSMWorkOrderFilterIsEditable(context) {
    let s4 = IsS4ServiceIntegrationEnabled(context);

    return (s4) ? !(context.binding && context.binding.ObjectID): !(context.binding && context.binding.OrderId);
}
