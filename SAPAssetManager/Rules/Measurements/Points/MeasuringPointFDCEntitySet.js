import libCommon from '../../Common/Library/CommonLibrary';

export default function MeasuringPointFDCEntitySet(context, actionBinding) {
    let binding = actionBinding || context.getPageProxy().binding;

    let swipeBinding = context.getPageProxy().getActionBinding();

    if (swipeBinding) {
        binding = swipeBinding;
    }
    if (!binding && context.binding) {
      binding = context.binding;
    }
    if (libCommon.isDefined(binding)) {
        let odataType = binding['@odata.type'];
        let operation = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue();
        let equipment = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue();
        let floc = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue();
        switch (odataType) {
          case operation: {
            return libCommon.getPageName(context) === 'PRTListViewPage' ?
              binding['@odata.readLink'] + '/Tools' :
              'MeasuringPoints';
          }
          case equipment:
            return binding['@odata.readLink'] + '/MeasuringPoints';
          case floc:
            return binding['@odata.readLink'] + '/MeasuringPoints';
          default:
            return 'MeasuringPoints';
        }
    }

}
