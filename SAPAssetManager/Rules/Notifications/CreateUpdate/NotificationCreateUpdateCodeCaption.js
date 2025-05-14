import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function NotificationCreateUpdateCodeCaption(context) {
    if (IsPhaseModelEnabled(context)) { 
        return context.localizeText('failure_mode');
    }
    return context.localizeText('code');
}
