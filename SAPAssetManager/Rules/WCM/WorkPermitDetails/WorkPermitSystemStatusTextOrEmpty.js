import { GetSystemStatusText } from '../Common/SystemStatusText';

export default function WorkPermitSystemStatusTextOrEmpty(context) {
    return GetSystemStatusText(context, context.binding.ActualSystemStatus).then(systemStatusText => systemStatusText || '');
}
