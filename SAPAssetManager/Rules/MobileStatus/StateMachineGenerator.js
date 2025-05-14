import { GetCachedMobileStatusSequences } from '../Common/CacheMobileStatusSeqs';
import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import libPersona from '../Persona/PersonaLibrary';
import libSuper from '../Supervisor/SupervisorLibrary';

export default class StateMachineGenerator {

    /**
     *
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context
     * @param {PMMobileStatus} currentStatus
     * @param {string} objectType
     */
    constructor(context, currentStatus, objectType, binding) {
        this._context = context;
        this._objectType = objectType;
        this._currentStatus = currentStatus;
        this._userRoleType = libCom.getStateVariable(context, 'UserRoleType');
        this._filters = [];
        this._binding = binding;
    }

    /**
     * Get user's role type and save it to state var and class property
     */
    async _getUserRoleType() {
        const isSupervisor = await libSuper.isUserSupervisor(this._context);
        const roleType = isSupervisor ? 'S' : 'T';

        libCom.setStateVariable(this._context, 'UserRoleType', roleType);
        this._userRoleType = roleType;
    }

    /**
     * Read status sequences from state machine based on user's role type, persona, object type and current status
     * @returns {ObservableArray}
     */
    async _readStatusSequences() {
        try {
            if (!this._userRoleType) {
                await this._getUserRoleType();
            }

            const queryOptions = await this._generateQueryOptions();
            const cachedSequence = this._lookUpStatusSequenceFromCache();
            
            if (libCom.isDefined(cachedSequence)) {
                return cachedSequence;
            }

            return await this._context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusSeqs', [], queryOptions)
                .then(statusSeqs => {
                    return libCom.isDefined(statusSeqs) ? statusSeqs : [];
                });
        } catch (err) {
            Logger.error('readStatusSequences', err);
            return [];
        }
    }

    async _generateQueryOptions() {

        await this._generateFilterOptions();
        const queryOptions = Object.entries({
            expand: 'NextOverallStatusCfg_Nav',
            filter: this._filters,
            orderby: 'ToStatus',
        })
            .map(([key, value]) => `$${key}=${Array.isArray(value) ? value.join(' and ') : value}`)
            .join('&');

        return queryOptions;
    }

    async _generateFilterOptions() {
        //Only add filter if the value is defined. Note that EAMOverallStatusProfile is an exception as an empty string is a valid value.
        this._filters = [
            this._currentStatus?.MobileStatus && `OverallStatusCfg_Nav/MobileStatus eq '${this._currentStatus.MobileStatus}'`,
            this._objectType && `OverallStatusCfg_Nav/ObjectType eq '${this._objectType}'`,
            this._currentStatus && `EAMOverallStatusProfile eq '${this._currentStatus.EAMOverallStatusProfile}'`,
            libPersona.getActivePersona(this._context) && `UserPersona eq '${libPersona.getActivePersona(this._context)}'`,
            this._userRoleType && `RoleType eq '${this._userRoleType}'`,
        ].filter(Boolean);

        await this._addToEAMOverallStatusProfileFilter();

    }

    async _addToEAMOverallStatusProfileFilter() {
        this._filters.push("ToEAMOverallStatusProfile eq ''");
        this._filters.push("PhaseModelRelevant eq ''");
    }

    /**
     * Get cached mobile status sequences and search for correct ones using filters
     * @returns {Array<EAMOverallStatusConfig>}
     */
    _lookUpStatusSequenceFromCache() {
        const cachedSequences = GetCachedMobileStatusSequences(this._context);

        if (cachedSequences) {
            const parsedFilters = this._parseFilterStringsToArray(this._filters);

            return cachedSequences.filter(sequence => {
                return parsedFilters.every(([property, value]) => {
                    return (Array.isArray(property) ?
                        sequence[property[0]]?.[property[1]] :
                        sequence[property]) === value;
                });
            });
        }

        return [];
    }

    /**
     * Parse an array of filter strings to use for searching among cached records
     * @param {Array<string>} filters 
     * @returns {Array<Array<string>>}
     */
    _parseFilterStringsToArray(filters) {
        return filters.map(filter => {
            // Remove quotes from filter string and split it to property and value
            let [property, value] = filter.replace(/'/g, '').split(' eq ');

            // If property is complex and contains a nav link, split it into two
            if (property.includes('/')) {
                property = property.split('/');
            }

            return [property, value];
        });
    }
}
