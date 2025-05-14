import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';
import libCom from '../Common/Library/CommonLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import libSupervisor from '../Supervisor/SupervisorLibrary';
import MobileStatusGenerator from './MobileStatusGenerator';
import PhaseModelAndSupervisorMobileStatusGenerator from './PhaseModelAndSupervisorMobileStatusGenerator';
import PhaseModelMobileStatusGenerator from './PhaseModelMobileStatusGenerator';
import S4ServiceMobileStatusGenerator from './S4ServiceMobileStatusGenerator';
import StateMachineGenerator from './StateMachineGenerator';
import StatusUIGenerator from './StatusUIGenerator';
import SupervisorMobileStatusGenerator from './SupervisorMobileStatusGenerator';
import GuidedFlowGenerator from '../GuidedWorkFlow/GuidedFlowGenerator';
import PhaseModelStateMachineGenerator from './PhaseModelStateMachineGenerator';
import IsGuidedFlowEnabled from '../GuidedWorkFlow/IsGuidedFlowEnabled';
import ValidationLibrary from '../Common/Library/ValidationLibrary';

const OVERALL_STATUS_CFG_PROPERTIES = [
    'MobileStatus',
    'Status',
    'ObjectType',
    'TransitionTextKey',
    'OverallStatusLabel',
    'Phase',
    'PhaseDesc',
    'Subphase',
    'SubphaseDesc',
    'SequenceNum',
    'EAMOverallStatus',
    'EAMOverallStatusProfile',
];

const OVERALL_STATUS_SEQ_PROPERTIES = [
    'TransitionType',
    'IsMandatory',
];

export default class MobileStatusGeneratorWrapper {

    /**
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context
     */
    constructor(context, bindingObject, objectType, currentStatus) {
        const binding = bindingObject || this._getBindingObject(context);
        const statusNavLinksConfig = this._getStatusNavLinksConfig(context);
        this._context = context;
        this._binding = binding;
        this._objectType = objectType;
        this._currentStatus = currentStatus || this._getCurrentMobileStatus(binding, statusNavLinksConfig);
        this._statusNavLinksConfig = statusNavLinksConfig;
    }

    /**
     * Get binding object, if it was not passed to the constructor
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context
     * @returns {MyWorkOrderHeader | MyWorkOrderOperation | MyWorkOrderSubOperation}
     */
    _getBindingObject(context) {
        let binding = context.binding;

        if (!libCom.isDefined(binding)) {
            const pageProxy = context.getPageProxy?.() || context;
            binding = pageProxy.getActionBinding();
        }

        return binding;
    }

    /**
     * Returns simple object to help determine mobile status nav link name for specific data type
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context
     * @returns {Object.<string, string>}
     */
    _getStatusNavLinksConfig(context) {
        return {
            [context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue()]: 'OrderMobileStatus_Nav',
            [context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue()]: 'OperationMobileStatus_Nav',
            [context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderSubOperation.global').getValue()]: 'SubOpMobileStatus_Nav',
            [context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue()]: 'MobileStatus_Nav',
            [context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceItem.global').getValue()]: 'MobileStatus_Nav',
            [context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceRequest.global').getValue()]: 'MobileStatus_Nav',
            [context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceConfirmation.global').getValue()]: 'MobileStatus_Nav',
            [context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceConfirmationItem.global').getValue()]: 'MobileStatus_Nav',
        };
    }

    /**
     * Returns PMMobileStatus for current binding
     * @param {MyWorkOrderHeader | MyWorkOrderOperation | MyWorkOrderSubOperation} binding
     * @param {Object.<string, string>} statusNavLinksConfig
     * @returns {PMMobileStatus}
     */
    _getCurrentMobileStatus(binding, statusNavLinksConfig) {
        const odataType = binding?.['@odata.type'];
        const navLinkName = statusNavLinksConfig[odataType];

        return binding[navLinkName];
    }

    async _rereadCurrentMobileStatus() {
        const navLinkName = this._statusNavLinksConfig[this._binding['@odata.type']];
        const currentMobileStatus = await this._context.read('/SAPAssetManager/Services/AssetManager.service',
            `${this._binding['@odata.readLink']}/${navLinkName}`, []);

        if (currentMobileStatus.getItem(0)) {
            this._currentStatus = currentMobileStatus.getItem(0);
        }
    }

    /**
     * Takes in array of status sequences read from state machine and
     * returns array of objects mapped to our desired format
     * @param {Array<EAMOverallStatusSeq>} statusSequences
     * @returns {Array<Object>}
     */
    _mapStatusSequencesToJSONObjects(statusSequences) {
        const resultItems = [];

        statusSequences.forEach(sequence => {
            const statusElement = {};
            const nextStatus = sequence.NextOverallStatusCfg_Nav;

            for (let property of OVERALL_STATUS_SEQ_PROPERTIES) {
                statusElement[property] = sequence[property];
            }
            for (let property of OVERALL_STATUS_CFG_PROPERTIES) {
                statusElement[property] = nextStatus[property];
            }
            resultItems.push(statusElement);
        });

        return resultItems;
    }

    /**
     * @param {Array<EAMOverallStatusSeq>} statusSequences
     * @returns {Array<Object>}
     */
    _mapGuidedFlowStatusSequencesToJSONObjects(statusSequences) {
        const resultItems = [];

        statusSequences.forEach(sequence => {
            const statusElement = {};
            const nextStatus = sequence.GuidedFlowToStatusConfig_Nav;
            if (ValidationLibrary.evalIsNotEmpty(nextStatus)) {
                statusElement.MobileStatus = sequence.ToStatus;
                statusElement.Status = sequence.FromStatus;
                statusElement.ObjectType = nextStatus.ObjectType;
                statusElement.TransitionTextKey = nextStatus.TransitionTextKey;
                statusElement.OverallStatusLabel = nextStatus.OverallStatusLabel;
                statusElement.Phase = nextStatus.Phase;
                statusElement.PhaseDesc = nextStatus.PhaseDesc;
                statusElement.Subphase = nextStatus.Subphase;
                statusElement.SubphaseDesc = nextStatus.SubphaseDesc;
                statusElement.SequenceNum = nextStatus.SequenceNum;
                statusElement.EAMOverallStatus = nextStatus.EAMOverallStatus;
                statusElement.EAMOverallStatusProfile = nextStatus.EAMOverallStatusProfile;
                statusElement.TransitionType = sequence.TransitionType;
                statusElement.IsMandatory = sequence.Mandatory;

                resultItems.push(statusElement);
            }
        });

        return resultItems;
    }

    /**
     * @returns {Array<Object>}
     */
    async _getStatusSequencesFromStateMachine() {
        let isGuidedFlowEnabled = IsGuidedFlowEnabled(this._context);

        if (isGuidedFlowEnabled) {
            const guidedFlowGenerator = await new GuidedFlowGenerator(this._context, this._binding, this._objectType, this._currentStatus.MobileStatus);
            const flowId = guidedFlowGenerator.getCurrentFlowId();
            if (ValidationLibrary.evalIsNotEmpty(flowId)) {
                const statusSequences = await guidedFlowGenerator.readStatusSequences();
                return this._mapGuidedFlowStatusSequencesToJSONObjects(statusSequences);
            }
        }

        const StateMachine = this._getStateMachineGeneratorBasedOnFeaturesEnabled();
        const statusSequences = await StateMachine._readStatusSequences();

        return this._mapStatusSequencesToJSONObjects(statusSequences);
    }


    /**
     * Generate UI item for specific status using entry read from state machine and override properties
     * @param {Object} statusOption
     * @param {Object.<string, import('./MobileStatusGenerator').StatusOverride>} overrideProperties
     * @returns {import('./StatusUIGenerator').ToolbarOrObjectCardActionItem | import('./StatusUIGenerator').ContextMenuItem}
     */
    _getStatusUIItem(statusOption, overrideProperties = {}) {
        return StatusUIGenerator.createUIItem(this._context, statusOption, overrideProperties);
    }

    _getStateMachineGeneratorBasedOnFeaturesEnabled() {
        if (IsPhaseModelEnabled(this._context)) {
            return new PhaseModelStateMachineGenerator(this._context, this._currentStatus, this._objectType, this._binding);
        } else {
            return new StateMachineGenerator(this._context, this._currentStatus, this._objectType, this._binding);
        }

    }

    /**
     * Returns mobile status generator class based on enabled user features.
     * Generator will form override properties for all possible statuses
     * @returns {PhaseModelAndSupervisorMobileStatusGenerator | SupervisorMobileStatusGenerator | PhaseModelMobileStatusGenerator | MobileStatusGenerator}
     */
    _getGeneratorClassBasedOnFeaturesEnabled() {
        const supervisorEnabled = libSupervisor.isSupervisorFeatureEnabled(this._context);
        const phaseModelEnabled = IsPhaseModelEnabled(this._context);
        const S4ServiceEnabled = IsS4ServiceIntegrationEnabled(this._context);
        const constructorArgs = [this._context, this._binding, this._currentStatus, this._objectType];

        if (S4ServiceEnabled) {
            return new S4ServiceMobileStatusGenerator(...constructorArgs);
        }

        if (supervisorEnabled && phaseModelEnabled) {
            return new PhaseModelAndSupervisorMobileStatusGenerator(...constructorArgs);
        }

        if (supervisorEnabled) {
            return new SupervisorMobileStatusGenerator(...constructorArgs);
        }

        if (phaseModelEnabled) {
            return new PhaseModelMobileStatusGenerator(...constructorArgs);
        }

        return new MobileStatusGenerator(...constructorArgs);
    }

    /**
     * Get an object with override properties for all possible statuses
     * @returns {Object.<string, import('./MobileStatusGenerator').StatusOverride>}
     */
    async _getMobileStatusOverrides() {
        const Generator = this._getGeneratorClassBasedOnFeaturesEnabled();
        return await Generator.getAllMobileStatusOptions();
    }

    /**
     * Generate next possible mobile status options
     * @returns {Array<import('./StatusUIGenerator').ToolbarOrObjectCardActionItem | import('./StatusUIGenerator').ContextMenuItem>}
     */
    async generateMobileStatusOptions(rereadStatus = false) {
        if (rereadStatus) {
            await this._rereadCurrentMobileStatus();
        }

        const statusSequences = await this._getStatusSequencesFromStateMachine();
        const overrides = await this._getMobileStatusOverrides();
        const resultItems = [];

        statusSequences.forEach(statusSeq => {
            const statusOverride = overrides[statusSeq.MobileStatus] || overrides.DEFAULT;

            if (statusOverride.Visible) {
                resultItems.push(this._getStatusUIItem(statusSeq, statusOverride));
            }
        });

        for (let key in overrides) {
            const override = overrides[key];

            // Check if there's override that tells us to ignore other status options (Clock In use case)
            if (override.OnlyOption && override.Visible) {
                return [this._getStatusUIItem({}, override)];
            }

            // Check if there's extra options that are not data driven
            if (override.ExtraOption && override.Visible) {
                resultItems.push(this._getStatusUIItem({}, override));
            }
        }

        return resultItems.filter(item => !!item);
    }
}
