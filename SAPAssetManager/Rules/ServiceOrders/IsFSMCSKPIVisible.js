import IsFSMCSSectionVisible from './IsFSMCSSectionVisible';
import libMobile from '../MobileStatus/MobileStatusLibrary';
import IsOperationLevelAssigmentType from '../WorkOrders/Operations/IsOperationLevelAssigmentType';
import IsClassicLayoutEnabled from '../Common/IsClassicLayoutEnabled';

export default function IsFSMCSKPIVisible(context) {
    let isOperationLevel = IsOperationLevelAssigmentType(context);
    let isHeaderLevel = libMobile.isHeaderStatusChangeable(context);
    return IsFSMCSSectionVisible(context) && (isHeaderLevel || isOperationLevel) && !IsClassicLayoutEnabled(context);
}
