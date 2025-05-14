import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import { StatusTransitionTextsVar } from './Library/GlobalStatusTransitionTexts';
import libCICO from '../ClockInClockOut/ClockInClockOutLibrary';
import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import libCom from './Library/CommonLibrary';
import CommonLibrary from './Library/CommonLibrary';

export default function CacheMobileStatusTexts(context) {
    const objectType = MobileStatusLibrary.getObjectTypeForCurrentAssignmentLevel(context);
    let readConfigPromises = [readConfigsForObjectType(context, objectType)];

    if (IsS4ServiceIntegrationEnabled(context)) {
        const serviceRequestObjectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/RequestMobileStatusObjectType.global').getValue();
        readConfigPromises.push(readConfigsForObjectType(context, serviceRequestObjectType));
    }
    
    return Promise.all(readConfigPromises)
        .then(mobileStatusConfigsArray => {
            mobileStatusConfigsArray.forEach(mobileStatusConfigs => {
                if (libCom.isDefined(mobileStatusConfigs)) {
                    createItemsAndSaveToGlobalVar(context, mobileStatusConfigs);
                }
            });
            
            addConfirmUnconfirmItems(context);
        });
}

function readConfigsForObjectType(context, objectType) {
    const select = ['TransitionTextKey', 'MobileStatus', 'OverallStatusLabel', 'ObjectType'];

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', select, `$filter=ObjectType eq '${objectType}'`);
}

function createItemsAndSaveToGlobalVar(context, mobileStatusConfigs) {
    const itemsToCache = {};
    const { STARTED } = MobileStatusLibrary.getMobileStatusValueConstants(context);
    let objectType = '';

    mobileStatusConfigs.forEach(cfg => {
        if (!objectType)
            objectType = cfg.ObjectType;

        let transitionText = cfg.TransitionTextKey ? context.localizeText(cfg.TransitionTextKey) : cfg.OverallStatusLabel;

        if (libCICO.isCICOEnabled(context) && cfg.MobileStatus === STARTED && CommonLibrary.getWorkOrderAssnTypeLevel(context) !== 'SubOperation') {
            transitionText = context.localizeText('clock_in');
        }

        itemsToCache[transitionText] = {
            MobileStatus: cfg.MobileStatus,
        };
    });

    addExtraItems(context, itemsToCache);

    StatusTransitionTextsVar.setStatusTransitionTexts(itemsToCache, objectType);
}

function addExtraItems(context, itemsToCache) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Supervisor.global').getValue())) {
        const { ASSIGN, UNASSIGN, REASSIGN } = MobileStatusLibrary.getMobileStatusValueConstants(context);
        const extraItems = {
            [context.localizeText('assign')]: {
                MobileStatus: ASSIGN,
            },
            [context.localizeText('reassign')]: {
                MobileStatus: REASSIGN,
            },
            [context.localizeText('unassign')]: {
                MobileStatus: UNASSIGN,
            },
        };

        Object.assign(itemsToCache, extraItems);
    }
}

function addConfirmUnconfirmItems(context) {
    const { CONFIRM, UNCONFIRM } = MobileStatusLibrary.getMobileStatusValueConstants(context);
    let cacheConfirmUnconfirm = false;
    let objectType = '';
    
    if (IsS4ServiceIntegrationEnabled(context)) {
        cacheConfirmUnconfirm = libCom.getS4AssnTypeLevel(context) === 'Header';
        objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ItemMobileStatusObjectType.global').getValue();
    } else {
        cacheConfirmUnconfirm = ['Header', 'Operation'].includes(libCom.getWorkOrderAssnTypeLevel(context));
        objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
    }

    if (cacheConfirmUnconfirm) {
        StatusTransitionTextsVar.setStatusTransitionTexts({
            [context.localizeText('confirm')]: {
                MobileStatus: CONFIRM,
            },
            [context.localizeText('confirm_and_complete')]: {
                MobileStatus: CONFIRM,
            },
            [context.localizeText('unconfirm')]: {
                MobileStatus: UNCONFIRM,
            },
        }, objectType);
    }
}
