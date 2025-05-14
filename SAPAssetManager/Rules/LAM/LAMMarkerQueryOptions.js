import CommonLibrary from '../Common/Library/CommonLibrary';


/**  @param {IControlProxy} controlProxy */
export default function LAMMarkerQueryOptions(controlProxy) {
    const section = CommonLibrary.GetParentSection(controlProxy);
    const selectedLrpId = section.getControl('LRPLstPkr').getValue().find(i => i);

    return selectedLrpId ? `$filter=LRPId eq '${selectedLrpId}'&$orderby eq 'Marker'` : '';
}
