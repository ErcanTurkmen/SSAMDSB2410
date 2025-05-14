import Logger from '../Log/Logger';

export default function HideCancelForErrorArchiveFix(context) {
    try {
        const clientData = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData();
        if (clientData.FromErrorArchive || clientData.ErrorObject) {
            context.setActionBarItemVisible(0, false);
        }
    } catch (err) {
        Logger.error('ErrorArchieve', err.message);
    }
}
