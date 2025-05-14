import libCom from '../../Common/Library/CommonLibrary';

export default function ReservationItemsFilterCaptionOpen(context) {
    let baseQuery = "ReservationNum eq '" + context.getPageProxy().binding.ReservationNum + "' and (RequirementQuantity eq 0 or WithdrawalQuantity eq 0 or RequirementQuantity gt WithdrawalQuantity)";
    const queryOptions = '$filter=(' + baseQuery + ')';
    return libCom.getEntitySetCount(context, 'ReservationItems', queryOptions).then(count => {
        return context.localizeText('open_items_x', [count]);
    });
}
