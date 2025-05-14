import { GetPriorityColor } from './WOPriorityStatusStyle';


export default function WCMPriorityStatusStyle(context) {
    return GetPriorityColor(context.binding.Priority);
}
