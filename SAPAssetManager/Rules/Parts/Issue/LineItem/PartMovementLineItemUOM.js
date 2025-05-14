import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function PartMovementLineItemUOM(pageClientAPI) {
    return pageClientAPI.binding.UnitOfEntry || CommonLibrary.getControlProxy(pageClientAPI,'UOMSim').getValue();
}
