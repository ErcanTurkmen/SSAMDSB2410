import Logger from '../../Log/Logger';

export default function WorkOrderOperationsSyncButtonVisible(context) {
  try {
    return context.getPageProxy().getControl('SectionedTable')?.getSections()[0].getSelectionMode() !== 'Multiple';
  } catch (error) {
    Logger.error(error);
    return true;
  }
}
