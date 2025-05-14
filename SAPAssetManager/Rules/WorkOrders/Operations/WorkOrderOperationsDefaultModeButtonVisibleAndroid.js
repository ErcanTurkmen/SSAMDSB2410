import isAndroid from '../../Common/IsAndroid';
import WorkOrderOperationsDefaultModeButtonVisible from './WorkOrderOperationsDefaultModeButtonVisible';

export default function WorkOrderOperationsDefaultModeButtonVisibleAndroid(context) {
  if (isAndroid(context)) {
    return WorkOrderOperationsDefaultModeButtonVisible(context);
  }
  return false;
}
