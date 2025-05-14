import {WorkOrderEventLibrary as LibWoEvent} from '../WorkOrderLibrary';

export default function WorkOrderTypeListPickerItems(controlProxy) {
    return LibWoEvent.createUpdateControlsPickerItems(controlProxy);
}
