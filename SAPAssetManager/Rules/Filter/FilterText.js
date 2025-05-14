import IsWindows from '../Common/IsWindows';

export default function FilterText(context) {
    if (IsWindows(context)) {
        return context.localizeText('filter');
    } 
    return context.localizeText('apply');
}
