import { GlobalVar } from './Library/GlobalCommon';
import libComm from './Library/CommonLibrary';

const enableFields = {
    'WorkOrder':
    {
        '':
        {
            'type' : 'WorkOrderHeader',
            'PlanningPlant':
            {
                enabled: false,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: false,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: false,
                default: null,
            },
        },
        '1':
        {
            'type' : 'WorkOrderHeader',
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '2':
        {
            'type' : 'WorkOrderOperation',
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '3':
        {
            'type' : 'WorkOrderSubOperation',
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '4':
        {
            'type' : 'WorkOrderOperation',
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '5':
        {
            'type' : 'WorkOrderHeader',
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '6':
        {
            'type' : 'WorkOrderOperation',
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '7':
        {
            'type' : 'WorkOrderHeader',
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '8':
        {
            'type' : 'WorkOrderHeader',
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        'A':
        {
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
    },
    'Notification':
    {
        '': {
            'PlanningGroup':
            {
                enabled: false,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: false,
                default: null,
            },
        },
        '1':
        {
            'PlanningGroup':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '2':
        {
            'PlanningGroup':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '3':
        {
            'PlanningGroup':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '4':
        {
            'PlanningGroup':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '5':
        {
            'PlanningGroup':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '6':
        {
            'PlanningGroup':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '7':
        {
            'PlanningGroup':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '8':
        {
            'PlanningGroup':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        'A':
        {
            'PlanningGroup':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
    },
    'FunctionalLocation':
    {

    },
    'Asset':
    {

    },
};
/**
 * Gets the control field table for the given entity ```type``` given the assignment type
 * @param {String} type one of 'WorkOrder', 'Notification', 'FunctionalLocation', or 'Asset'
 */
export default function GenerateAssnTypeTable(context,type) {
    let fieldparams;
    let woAssnType = libComm.getWorkOrderAssignmentType(context);
    let notifAssnType = libComm.getNotificationAssignmentType(context);
    switch (type) {
        case 'WorkOrder':
            fieldparams = enableFields.WorkOrder[woAssnType];
            if (woAssnType === '8' || woAssnType === '6') {
                fieldparams.MainWorkCenter.default = libComm.getDefaultUserParam('USER_PARAM.VAP');
            } else {
                fieldparams.MainWorkCenter.default = null;
            }
            if (libComm.getDefaultUserParam('USER_PARAM.IWK')) {
                fieldparams.PlanningPlant.default = libComm.getDefaultUserParam('USER_PARAM.IWK');
            } else {
                fieldparams.PlanningPlant.default = GlobalVar.getAppParam().WORKORDER.PlanningPlant;
            }
            if (libComm.getDefaultUserParam('USER_PARAM.WRK')) {
                fieldparams.WorkCenterPlant.default = libComm.getDefaultUserParam('USER_PARAM.WRK');
                } else {
                fieldparams.WorkCenterPlant.default = fieldparams.PlanningPlant.default;
            }
            break;
        case 'Notification':
            fieldparams = enableFields.Notification[notifAssnType];
            fieldparams.MainWorkCenter.default = libComm.getDefaultUserParam('USER_PARAM.VAP');
            fieldparams.PlanningGroup.default = libComm.getDefaultUserParam('USER_PARAM.IHG');
            break;
        default:
            break;
    }

    return fieldparams;
}
