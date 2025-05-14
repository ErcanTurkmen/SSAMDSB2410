export default function InspectionLotListViewEntitySet(context) {
    try {
        let binding = '';
        if (Object.prototype.hasOwnProperty.call(context.evaluateTargetPath('#Page:-Previous'),'context') && Object.prototype.hasOwnProperty.call(context.evaluateTargetPath('#Page:-Previous').context,'binding')) {
            binding = context.evaluateTargetPath('#Page:-Previous').context.binding;
        } else if (context.binding) {
            binding = context.binding;
        }
        if (binding && (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader' || binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation')) {
            return binding['@odata.readLink'] + '/EAMChecklist_Nav';
        }
        return 'EAMChecklistLinks';
    } catch (error) {
        return 'EAMChecklistLinks';
    }
}
