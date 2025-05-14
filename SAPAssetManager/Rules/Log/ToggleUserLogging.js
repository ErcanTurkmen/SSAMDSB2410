import libCom from '../Common/Library/CommonLibrary';

export default function ToggleUserLogging(context) {
    const logger = context.getLogger();
    try {
        const dict = libCom.getControlDictionaryFromPage(context);
        const enableLogSwitchControl = dict?.EnableLogSwitch;
        const logLevelLstPkrControl = dict?.LogLevelLstPkr;
        const logCategoriesLstPkr = dict?.LogCategoriesLstPkr;
        const sendActivityLogButton = dict?.Send;
        const switchValue = enableLogSwitchControl?.getValue();
        if (switchValue) {
            logger.on();
            logLevelLstPkrControl.setVisible(true);
            logLevelLstPkrControl.setEditable(true);
            logLevelLstPkrControl.redraw();
            sendActivityLogButton.setVisible(true);
            sendActivityLogButton.redraw(true);
            let logLevel = logLevelLstPkrControl.getValue();
            if (logLevel?.[0]?.ReturnValue === 'Trace') {
                logCategoriesLstPkr.setVisible(true);
                logCategoriesLstPkr.setEditable(true);
            }
        } else {
            logger.off();
            logLevelLstPkrControl.setEditable(false);
            logLevelLstPkrControl.redraw();
            sendActivityLogButton.setVisible(false);
            sendActivityLogButton.redraw(false);
            logCategoriesLstPkr.setVisible(false);
            logCategoriesLstPkr.setEditable(false);
        }
        return switchValue;
    } catch (exception) {
        logger.log(String(exception), 'Error');
        return undefined;
    }
}
