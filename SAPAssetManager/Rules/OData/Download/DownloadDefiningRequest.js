import libVal from '../../Common/Library/ValidationLibrary';
import common from '../../Common/Library/CommonLibrary';
import downloadActionsOrRulesSequence from './DownloadActionsOrRulesSequence';

export default function DownloadDefiningRequest(context, index) {
    let sequences = downloadActionsOrRulesSequence(context);
    if (libVal.evalIsEmpty(index)) {
        index = 0;
    }
    if (sequences.length > 0 && !libVal.evalIsEmpty(sequences[index])) {
        let object = getObject(sequences, index);
        // activityIndicatorIndex is needed to keep track of the displayed indicators, as well as to close them in the correct order
        const activityIndicatorIndex = context.showActivityIndicator(sequences[index].Caption);
        if (!libVal.evalIsEmpty(sequences[index].Action)) {
            return context.executeAction(object).then(() => {
                if (index === sequences.length - 1) {
                    context.dismissActivityIndicator(activityIndicatorIndex);
                    common.setInitialSync(context);
                    common.setApplicationLaunch(context, true);
                    return Promise.resolve();
                }
                index = index + 1;
                context.dismissActivityIndicator(activityIndicatorIndex);
                return DownloadDefiningRequest(context, index);
            }).catch(function() {
                return false;
            });
        } else if (!libVal.evalIsEmpty(sequences[index].Rule)) {
            return context.getDefinitionValue(sequences[index].Rule).then(() => {
                if (index === sequences.length - 1) {
                    context.dismissActivityIndicator(activityIndicatorIndex);
                    common.setInitialSync(context);
                    common.setApplicationLaunch(context, true);
                    return Promise.resolve();
                }
                index = index + 1;
                context.dismissActivityIndicator(activityIndicatorIndex);
                return DownloadDefiningRequest(context, index);
            }).catch(function() {
                return false;
            });
        }
    }
}

function getObject(sequences, index) {
    if (!libVal.evalIsEmpty(sequences[index].Properties)) {
        return {
            'Name': sequences[index].Action,
            'Properties': sequences[index].Properties,
        };
    } else {
        return {
            'Name': sequences[index].Action,
        };
    }
}
