import IsWCMWorkOrderEnabled from './IsWCMWorkOrderEnabled';
import IsPMWorkOrderEnabled from './IsPMWorkOrderEnabled';

export default function IsWorkOrderEnabled(clientAPI) {
    return IsPMWorkOrderEnabled(clientAPI) || IsWCMWorkOrderEnabled(clientAPI);
}
