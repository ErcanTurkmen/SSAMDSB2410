import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterActivityReasonQueryOptions(context) {

    let meterTransactionType = libMeter.getMeterTransactionType(context);

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive || context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
        meterTransactionType = context.binding.ISUProcess + '_EDIT';
    }

    if (meterTransactionType === 'INSTALL' || meterTransactionType === 'INSTALL_EDIT' || meterTransactionType === 'REP_INST' || meterTransactionType === 'REP_INST_EDIT') {
        return "$filter=PermitForInstallation eq 'X'&$orderby=ActivityReason asc";
    } else if (meterTransactionType === 'REMOVE' || meterTransactionType === 'REMOVE_EDIT' || meterTransactionType === 'REPLACE' || meterTransactionType === 'REPLACE_EDIT') { 
        return "$filter=PermitForRemoval eq 'X'&$orderby=ActivityReason asc";
    }

    return '';
}
