import SupervisorLibrary from '../Supervisor/SupervisorLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';
import CommonLibrary from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import { GetCachedMobileStatusSequences } from '../Common/CacheMobileStatusSeqs';

export default class GuidedFlowGenerator {
    /*
        Generate work flow
            a) identify the work flow id
            b) identify the current step
            b) generate the steps for the work flow id (optional as object cards or context menu swipe actions may not require steps)
            c) get the mobile statuses for each steps in the work flow
            d) get the mobile stuatuses without steps for the work flow
        
    */

    /**
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context 
     * @param {Binding} bindingObject 
     * @param {string} objectType 
     * @param {string} currentMobileStatus
     * @returns {GuidedFlowGenerator}
     */
    constructor(context, bindingObject, objectType, currentMobileStatus) {
        this._context = context;
        this._binding = bindingObject;
        this._objectType = objectType;
        this._currentMobileStatus = currentMobileStatus;
        return (async () => {
            this._currentStepSequence = 0;
            this._feature = '';
            this._isSupervisorEnabled = SupervisorLibrary.isSupervisorFeatureEnabled(context);
            if (this._isSupervisorEnabled) {
                this._feature = context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Supervisor.global').getValue();
            }
            this._userRoleType = await SupervisorLibrary.isUserSupervisor(context) ? 'S' : 'T';
            this._persona = PersonaLibrary.getActivePersona(context);
            this._flowid = await this.identifyGuidedFlowID();
            this._currentStep = await this.identifyCurrentStep();
            return this;
        })();
    }

    /**
     * Identify the guided flow id
     * @returns {Promise<string>} flow id
     */
    async identifyGuidedFlowID() {
        try {
            //how to identify a flow by a feature or multiple features?
            const queryOptions = Object.entries({
                filter: [
                    `ObjectType eq '${this._objectType}'`,
                    `Persona eq '${this._persona}'`,
                    `Role eq '${this._userRoleType}'`,
                    `Feature eq '${this._feature}'`,
                ],
            })
                .map(([key, value]) => `$${key}=${Array.isArray(value) ? value.join(' and ') : value}`)
                .join('&');

            let flows = await this._context.read('/SAPAssetManager/Services/AssetManager.service', 'GuidedFlowHeaders', [], queryOptions);
            return this.parseFlows(flows);

        } catch (err) {
            Logger.error('identifyGuidedFlowID', err);
            return '';
        }
    }

    parseFlows(flows) {
        let identifedFlow = '';
        if (flows && flows.length === 1) {
            identifedFlow = flows.getItem(0).FlowID;
        } else if (flows && flows.length > 0) {
            let identifedFlows = [];
            flows.forEach(flow => {
                if (flow.ObjectGroupEntityProperty && flow.ObjectGroupValue && flow.ObjectGroup1EntityProerty && flow.ObjectGroup1Value) {
                    if (this.evaluateObjectGroup(flow.ObjectGroupEntityProperty, flow.ObjectGroupNav, flow.ObjectGroupValue)
                        && this.evaluateObjectGroup(flow.ObjectGroup1EntityProerty, flow.ObjectGroup1Nav, flow.ObjectGroup1Value)) {
                        identifedFlows.push(flow);
                    }
                }
                if (flow.ObjectGroupEntityProperty && flow.ObjectGroupValue) {
                    if (this.evaluateObjectGroup(flow.ObjectGroupEntityProperty, flow.ObjectGroupNav, flow.ObjectGroupValue)) {
                        identifedFlows.push(flow);
                    }
                } else if (flow.ObjectGroup1EntityProerty && flow.ObjectGroup1Value) {
                    if (this.evaluateObjectGroup(flow.ObjectGroup1EntityProerty, flow.ObjectGroup1Nav, flow.ObjectGroup1Value)) {
                        identifedFlows.push(flow);
                    }
                }

            });

            if (identifedFlows && identifedFlows.length === 1) {
                identifedFlow = identifedFlows[0].FlowID;
            } else if (identifedFlows && identifedFlows.length > 1) {
                identifedFlows.forEach(flow => {
                    if (flow.Default === 'X') {
                        identifedFlow = flow.FlowID;
                    }
                });
                if (!identifedFlow) {
                    identifedFlow = flows.getItem(0).FlowID;
                }
            } else if (flows && flows.length > 1) {
                flows.forEach(flow => {
                    if (flow.Default === 'X') {
                        identifedFlow = flow.FlowID;
                    }
                });
                if (!identifedFlow) {
                    identifedFlow = flows.getItem(0).FlowID;
                }
            }
        }
        return identifedFlow;
    }

    evaluateObjectGroup(entityProperty, groupNav, groupValue) {

        if (entityProperty && groupValue) {
            let object = this._binding;
            if (groupNav) {
                object = this._binding[`${groupNav}`];
            }
            if (object) {
                if (groupValue.indexOf(',')) {
                    let results = groupValue.split(/, ?/).map(orderType => (orderType === object[entityProperty])).filter((value) => value === true);
                    return results.length > 0;
                }
                return (groupValue === object[entityProperty]);
            }
        }

        return false;
    }

    /**
     * Identify the current step
     * @returns {Promise<GuidedFlowStep>} GuidedFlowStep
     */
    async identifyCurrentStep() {
        if (this._flowid) {
            const queryOptions = Object.entries({
                filter: [
                    `FromStatus eq '${this._currentMobileStatus}'`,
                    `FlowID eq '${this._flowid}'`,
                ],
            })
                .map(([key, value]) => `$${key}=${Array.isArray(value) ? value.join(' and ') : value}`)
                .join('&');

            let results = await this._context.read('/SAPAssetManager/Services/AssetManager.service', 'GuidedFlowStatusSeqs', [], queryOptions);
            if (results && results.length > 0) {
                let step = results.getItem(0).Step;
                let stepSeqResults = await this._context.read('/SAPAssetManager/Services/AssetManager.service', 'GuidedFlowSteps', [], `$filter=FlowID eq '${this._flowid}' and ToStep eq '${step}'`);
                if (stepSeqResults && stepSeqResults.length > 0) {
                    this._currentStepSequence = parseInt(stepSeqResults.getItem(0).Sequence);
                    return step;
                }
            } else {
                const completeQueryOptions = Object.entries({
                    filter: [
                        `ToStatus eq '${this._currentMobileStatus}'`,
                        `FlowID eq '${this._flowid}'`,
                    ],
                })
                    .map(([key, value]) => `$${key}=${Array.isArray(value) ? value.join(' and ') : value}`)
                    .join('&');
                let completeResults = await this._context.read('/SAPAssetManager/Services/AssetManager.service', 'GuidedFlowStatusSeqs', [], completeQueryOptions);
                if (completeResults && completeResults.length === 1) {
                    let fromStep = completeResults.getItem(0).Step;
                    let completeStepResults = await this._context.read('/SAPAssetManager/Services/AssetManager.service', 'GuidedFlowSteps', [], `$filter=FlowID eq '${this._flowid}' and FromStep eq '${fromStep}'`);
                    if (completeStepResults && completeStepResults.length === 1) {
                        this._currentStepSequence = parseInt(completeStepResults.getItem(0).Sequence);
                        return completeStepResults.getItem(0).ToStep;
                    }
                }
            }
        }
        return '';
    }

    /**
     * Rutrun the current step
     * @returns {string} GuidedFlowStep
     */
    getCurrentStep() {
        return this._currentStep;
    }

    /**
     * Rutrun the current step sequence
     * @returns {int} GuidedFlowStep
     */
    getCurrentStepSequence() {
        return this._currentStepSequence;
    }

    /**
     * Rutrun the current flow id
     * @returns {string} FlowID
     */
    getCurrentFlowId() {
        return this._flowid;
    }


    /**
     * Generates the flow steps
     * @returns {JSON {<string>, Array[<GuidedFlowStep>]}}
     */
    async generateFlowSteps() {
        let workFlowSteps = [];
        return this.readFlowSteps().then(steps => {
            if (steps && steps.length > 0) {
                steps.map(step => {
                    workFlowSteps.push(step);
                });
                return {
                    'FlowID': this._flowid,
                    'Steps': workFlowSteps,
                };
            }
            return {};
        });
    }

    /**
     * Reads flow steps with the statuses 
     * @returns {ObservableArray}
     */
    async readFlowSteps() {
        if (this._flowid) {
            try {
                const queryOptions = Object.entries({
                    expand: 'GuidedFlowHeader_Nav',
                    filter: [
                        `FlowID eq '${this._flowid}'`,
                    ],
                    orderby: 'Sequence',
                })
                    .map(([key, value]) => `$${key}=${Array.isArray(value) ? value.join(' and ') : value}`)
                    .join('&');

                let flowStepsWithStatuses = await this._context.read('/SAPAssetManager/Services/AssetManager.service', 'GuidedFlowSteps', [], queryOptions);
                return flowStepsWithStatuses || [];
            } catch (err) {
                Logger.error('readFlowSteps', err);
                return [];
            }
        }
        return [];
    }

    /**
     * Reads the statuses for the current step
     * @returns {ObservableArray}
     */
    async readStatusSequences() {
        if (this._flowid) {
            try {
                const filters = [
                    `FlowID eq '${this._flowid}'`,
                    `FromStatus eq '${this._currentMobileStatus}'`,
                ];
                const queryOptions = Object.entries({
                    expand: 'GuidedFlowToStatusConfig_Nav',
                    filter: filters,
                    orderby: 'ToStatus',
                })
                    .map(([key, value]) => `$${key}=${Array.isArray(value) ? value.join(' and ') : value}`)
                    .join('&');
                const cachedSequence = this.lookUpStatusSequenceFromCache(filters);

                if (CommonLibrary.isDefined(cachedSequence)) {
                    return cachedSequence;
                }

                let statusSeqs = await this._context.read('/SAPAssetManager/Services/AssetManager.service', 'GuidedFlowStatusSeqs', [], queryOptions);
                return CommonLibrary.isDefined(statusSeqs) ? statusSeqs : [];
            } catch (err) {
                Logger.error('readStatusSequences', err);
                return [];
            }
        }
        return [];
    }

    /**
     * Get cached mobile status sequences and search for correct ones using filters
     * @returns {Array<EAMOverallStatusConfig>}
     */
    lookUpStatusSequenceFromCache(filters) {
        const cachedSequences = GetCachedMobileStatusSequences(this._context);

        if (cachedSequences) {
            const parsedFilters = this.parseFilterStringsToArray(filters);

            return cachedSequences.filter(sequence => {
                return parsedFilters.every(([property, value]) => sequence[property] === value);
            });
        }

        return [];
    }

    /**
     * Parse an array of filter strings to use for searching among cached records
     * @param {Array<string>} filters 
     * @returns {Array<Array<string>>}
     */
    parseFilterStringsToArray(filters) {
        return filters.map(filter => {
            // Remove quotes from filter string and split it to property and value
            return filter.replace(/'/g, '').split(' eq ');
        });
    }
}
