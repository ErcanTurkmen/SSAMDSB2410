import SupervisorLibrary from '../Supervisor/SupervisorLibrary';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';
import CommonLibrary from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default class PhaseLibrary {

    static isPhaseModelActiveInDataObject(context, dataObject) {
        if (!IsPhaseModelEnabled(context)) return Promise.resolve(false);
        if (!dataObject) return Promise.resolve(false);

        let type = dataObject.OrderType || (dataObject.WOHeader ? dataObject.WOHeader.OrderType : '');
        if (type) {
            let activeTypes = CommonLibrary.getStateVariable(context, 'PhaseModelActiveTypes') || {};
            if (Object.keys(activeTypes).includes(type)) {
                return Promise.resolve(activeTypes[type]);
            }
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=PhaseModelActive eq 'X' and OrderType eq '${type}'`).then(result => {
                let isActive = result && !!result.length;
                activeTypes[type] = isActive;
                CommonLibrary.setStateVariable(context, 'PhaseModelActiveTypes', activeTypes);
                return isActive;
            });
        }

        return Promise.resolve(false);
    }

    static isSupervisorStatus(status) {
        return status && status.RoleType === 'S';
    }

    static supervisorStatusChangeAllowed(context, status) {
        if (SupervisorLibrary.isUserSupervisor(context)) {
            return IsPhaseModelEnabled(context) && PhaseLibrary.isSupervisorStatus(status);
        }

        return false;
    }

    static isOperationPhaseStatusChangeablePromise(context, operationObject) {
        const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

        let beforeCheckPromises = [
            PhaseLibrary.getActivePhaseControls(context, operationObject),
            context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], `$filter=MobileStatus eq '${COMPLETED}' and ObjectType eq \'WO_OPERATION\'`),
        ];

        return Promise.all(beforeCheckPromises).then(results => {
            let stopKeys = results[0] || [];
            let nextStatus = results[1] && results[1].length ? results[1].getItem(0) : {};

            let isPhaseStatusChangeBlocked = PhaseLibrary.isPhaseStatusChangeBlocked(stopKeys, nextStatus);

            if (isPhaseStatusChangeBlocked) {
                return context.executeAction(PhaseLibrary.getPhaseStatusChangeBlockedMessageAction(context)).then(() => {
                    return Promise.reject();
                });
            }

            return Promise.resolve();
        });
    }

    static getActivePhaseControls(context, objectBinding) {
        if (IsPhaseModelEnabled(context) && objectBinding) {
            // Phase model is enabled. See if any active phase controls exist
            return context.read('/SAPAssetManager/Services/AssetManager.service', `${objectBinding['@odata.readLink']}/PhaseControl_Nav`, [], "$filter=IsActive eq 'X' and ProcessSubphase ne '' and ProcessPhase ne ''").then(result => {
                return result._array;
            });
        } else {
            // Return empty array of phase controls so nothing is blocked
            return Promise.resolve([]);
        }
    }

    static isPhaseStatusChangeBlocked(phaseControlsKeys, nextStatus) {
        let isNextPhaseStatusBlocked = phaseControlsKeys.find(stopKey => stopKey.ProcessPhase === nextStatus.Phase && stopKey.ProcessSubphase === nextStatus.Subphase);

        return !!isNextPhaseStatusBlocked;
    }

    static getPhaseStatusChangeBlockedMessageAction(context) {
        return {
            'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
            'Properties': {
                'Title': context.localizeText('transition_blocked'),
                'Message': context.localizeText('transition_blocked_msg'),
                'OKCaption': context.localizeText('ok'),
            },
        };
    }

    static addPhaseControlFilterResult(context, filterPageName, filterResults) {
        try {
            let phaseControlFilterValues = context.evaluateTargetPath(`#Page:${filterPageName}/#Control:PhaseControlFilter/#Value`);
            if (phaseControlFilterValues.length > 0) {
                let filters = [];
                let filterDisplayStrings = [];
                phaseControlFilterValues.forEach(value => {
                    let phaseControl = value.ReturnValue;
                    filters.push(`(pc/PhaseControl eq '${phaseControl}' and pc/IsActive eq 'X')`);
                    filterDisplayStrings.push(phaseControl);
                });

                let filterString = `PhaseControl_Nav/any(pc : ${filters.join(' or ')})`;
                let filterDisplayString = filterDisplayStrings.join('; ');
                let filter = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, [filterString], true, undefined, [filterDisplayString]);
                filterResults.push(filter);
            }
        } catch (error) {
            Logger.error('addPhaseControlFilterResult', error);
        }
    }

    static addPhaseControlKeyFilterResult(context, filterPageName, filterResults) {
        try {
            let phaseControlKeyFilterValues = context.evaluateTargetPath(`#Page:${filterPageName}/#Control:PhaseControlKeyFilter/#Value`);
            if (phaseControlKeyFilterValues.length > 0) {
                let filters = [];
                let filterDisplayStrings = [];
                phaseControlKeyFilterValues.forEach(value => {
                    let phaseControlKey = value.ReturnValue;
                    filters.push(`pc/PhaseControlKey eq '${phaseControlKey}'`);
                    filterDisplayStrings.push(value.DisplayValue.split('-')[1].trim());
                });

                let filterString = `PhaseControl_Nav/any(pc : ${filters.join(' or ')})`;
                let filterDisplayString = filterDisplayStrings.join('; ');
                let filter = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, [filterString], true, undefined, [filterDisplayString]);
                filterResults.push(filter);
            }
        } catch (error) {
            Logger.error('addPhaseControlKeyFilterResult', error);
        }
    }

    static getFiltersFromPage(context, pageName) {
        let filters = [];

        if (!pageName) return filters;

        try {
            let sectionedTable = context.evaluateTargetPathForAPI(`#Page:${pageName}`).getControls()[0];

            if (sectionedTable) {
                filters = sectionedTable.filters;
                return JSON.parse(context.convertFilterCriteriaArrayToJSONString(filters));
            }

            return filters;
        } catch (error) {
            Logger.error('getFiltersFromPage', error);
            return filters;
        }
    }

    static setPhaseControlKeyFilterValue(context, filterPageName, filters) {
        let filterValues = PhaseLibrary._parseFilterValue(filters, 'PhaseControl');
        if (filterValues.length) {
            context.evaluateTargetPath(`#Page:${filterPageName}/#Control:PhaseControlFilter`).setValue(filterValues);
        }
    }

    static setPhaseControlFilterValue(context, filterPageName, filters) {
        let filterValues = PhaseLibrary._parseFilterValue(filters, 'PhaseControlKey');

        if (filterValues.length) {
            context.evaluateTargetPath(`#Page:${filterPageName}/#Control:PhaseControlKeyFilter`).setValue(filterValues);
        }
    }

    static _parseFilterValue(filters, filterPropertyName) {
        let filter = filters.find(f => f.filterItems.find(item => item.includes(`${filterPropertyName} eq`)));
        let values = [];

        if (filter) {
            const searchString = new RegExp(`${filterPropertyName} eq '(.+?)'`, 'g'); // extracts '<property> eq <value>' from the filter query
            const selectedOptions = filter.filterItems[0].match(searchString);
            if (selectedOptions && selectedOptions.length) {
                values = selectedOptions.map(value => value.split('\'')[1]);
            }
        }

        return values;
    }

    static async isLocalPhaseObject(context, binding) {
        const isLocal = CommonLibrary.isCurrentReadLinkLocal(binding['@odata.readLink']);
        const isPhaseObject = await PhaseLibrary.isPhaseModelActiveInDataObject(context, binding);
        return isLocal && isPhaseObject;
    }
}
