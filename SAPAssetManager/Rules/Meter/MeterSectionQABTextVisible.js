import MeterSectionLibrary from './Common/MeterSectionLibrary';

export default function MeterSectionQABTextVisible(clientAPI) {
    return MeterSectionLibrary.newObjectCellSectionVisible(clientAPI, 'QAB', clientAPI.getPageProxy()?.binding);
}
