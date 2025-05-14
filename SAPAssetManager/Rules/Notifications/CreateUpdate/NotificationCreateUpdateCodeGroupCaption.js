import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function NotificationCreateUpdateCodeGroupCaption(context) {
    if (IsPhaseModelEnabled(context)) { 
        return context.localizeText('failure_mode_group');
    }
    return context.localizeText('code_group');
}
