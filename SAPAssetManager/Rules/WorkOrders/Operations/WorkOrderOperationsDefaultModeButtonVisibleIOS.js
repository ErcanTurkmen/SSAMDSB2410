import isAndroid from '../../Common/IsAndroid';
import WorkOrderOperationsDefaultModeButtonVisible from './WorkOrderOperationsDefaultModeButtonVisible';

export default function WorkOrderOperationsDefaultModeButtonVisibleIOS(context) {
  if (!isAndroid(context)) {
    return WorkOrderOperationsDefaultModeButtonVisible(context);
  }
  return false;
}
