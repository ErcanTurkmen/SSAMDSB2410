import MeasuringPointsCount from '../Measurements/Points/MeasuringPointsCount';
import enableMeasurementCreate from '../UserAuthorizations/Measurements/EnableMeasurementCreate';
import PersonaLibrary from '../Persona/PersonaLibrary';

/**
* Show/Hide take Reading button based on Persona or User Authorization and measuring points
* @param {IClientAPI} context
*/
export default function EquipmentTakeReadingIsVisible(context) {
    if (PersonaLibrary.isWCMOperator(context)) {
        return false;
    }

    context.getPageProxy = () => context;
    return MeasuringPointsCount(context).then(e => {
        return e > 0 ? enableMeasurementCreate(context) : false;
    });
}

