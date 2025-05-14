import libVal from '../Common/Library/ValidationLibrary';

export default function NotificationNPCDefault(context) {
    let binding = context.binding;
    if (libVal.evalIsEmpty(binding.NotifPrecessingContext))	{
        binding.NotifPrecessingContext = '00';
    }
    return binding.NotifPrecessingContext;
}
