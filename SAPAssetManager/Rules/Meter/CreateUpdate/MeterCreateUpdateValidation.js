import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';
import libCom from '../../Common/Library/CommonLibrary';
import IsMeterTakeReadingFlow from './IsMeterTakeReadingFlow';
import ValidateMeterReadings from './OnCommit/ValidateMeterReadings';

function validateRequiredField(context, control) {
    if (!libCom.isDefined(control.getValue())) {
        const message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, control, message);
        return Promise.reject();
    } else {
        return Promise.resolve(true);
    }
}

export default function MeterCreateUpdateValidation(context) {
    if (IsMeterTakeReadingFlow(context)) {
        return ValidateMeterReadings(context).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }  

    const dict = libCom.getControlDictionaryFromPage(context);
    const validations = [];

    const ReasonLstPkr = dict.ReasonLstPkr;
    ReasonLstPkr.clearValidation();
    validations.push(validateRequiredField(context, ReasonLstPkr));

    const MeterLstPkr = dict.MeterLstPkr;
    MeterLstPkr.clearValidation();
    validations.push(validateRequiredField(context, MeterLstPkr));

    const ConnectionLstPkr = dict.ConnectionLstPkr;
    if (ConnectionLstPkr) {
        ConnectionLstPkr.clearValidation();
        validations.push(validateRequiredField(context, ConnectionLstPkr));
    }

    const MovementTypeLstPkr = dict.MovementTypeLstPkr;
    if (MovementTypeLstPkr) {
        MovementTypeLstPkr.clearValidation();
        if (MovementTypeLstPkr.visible !== false) {
            validations.push(validateRequiredField(context, MovementTypeLstPkr));
        }
    }

    const ReceivingPlantLstPkr = dict.ReceivingPlantLstPkr;
    if (ReceivingPlantLstPkr) {
        ReceivingPlantLstPkr.clearValidation();
        if (ReceivingPlantLstPkr.visible !== false) {
            validations.push(validateRequiredField(context, ReceivingPlantLstPkr));
        }
    }

    const StorageLocationLstPkr = dict.StorageLocationLstPkr;
    if (StorageLocationLstPkr) {
        StorageLocationLstPkr.clearValidation();
        if (StorageLocationLstPkr.visible !== false) {
            validations.push(validateRequiredField(context, StorageLocationLstPkr));
        }
    }

    if (!IsClassicLayoutEnabled(context) && libCom.getPageName(context) === 'MeterInstallWithEDTPage') {
        validations.push(ValidateMeterReadings(context));
    }

    return Promise.all(validations).then(() => {
        return true;
    }).catch(() => {
        return false;
    });
}
