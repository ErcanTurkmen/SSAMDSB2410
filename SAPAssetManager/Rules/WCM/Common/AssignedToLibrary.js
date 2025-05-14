import libCommon, { WCMAssignmentType } from '../../Common/Library/CommonLibrary';
import { PartnerFunction } from '../../Common/Library/PartnerFunction';
import libVal from '../../Common/Library/ValidationLibrary';

export default class AssignedToLibrary {

    static IsAssignedToVisibleByAssignmentsWorkPermit(assignments) {
        const AT = WCMAssignmentType;
        assignments = new Set(assignments);
        return (assignments.has(AT.PartnerFunction) && [AT.UserPlant, AT.UserWorkCenter, AT.UserPlannerGroup, AT.DependencyQue].some(i => assignments.has(i)));  // 4 AND (1 or 2 or 3 or D)
    }

    static IsAssignedToVisibleByAssignmentsCertificate(assignments) {
        const AT = WCMAssignmentType;
        assignments = new Set(assignments);
        return (assignments.has(AT.PartnerFunction) && [AT.UserPlant, AT.UserWorkCenter, AT.UserPlannerGroup, AT.SelectionVariant, AT.OperationalList, AT.DependencyQue].some(i => assignments.has(i)));  // 4 AND (1 or 2 or 3 or 5 or 6 or D)
    }

    static IsAssignedToVisibleByAssignmentsPartnerOperationalItem(assignments) {
        return this.IsAssignedToVisibleByAssignmentsWorkPermit(new Set(assignments));  // 4 AND (1 or 2 or 3 or D)
    }

    static IsAssignedToVisibleByAssignmentsSVOperationalItem(assignments) {
        const AT = WCMAssignmentType;
        assignments = new Set(assignments);
        return ([AT.SelectionVariant, AT.OperationalList].some(i => assignments.has(i)) && [AT.UserPlant, AT.UserWorkCenter, AT.UserPlannerGroup, AT.DependencyQue].some(i => assignments.has(i)));  // (5 or 6) AND (1 or 2 or 3 or D)
    }

    static GetAssignedToMeReturnValue(partnersNavProp) {
        return `${partnersNavProp}/any(p: p/PartnerFunction eq '${PartnerFunction.getPersonnelPartnerFunction()}' and p/PersonnelNum eq '${libCommon.getPersonnelNumber()}')`;
    }

    static GetUnassignedReturnValue(partnersNav) {
        return `sap.entityexists(${partnersNav}) eq false or ${partnersNav}/all(p: p/PartnerFunction ne '${PartnerFunction.getPersonnelPartnerFunction()}')`;
    }

    static GetPageName(context) {
        const pageProxy = context.getPageProxy ? context.getPageProxy() : context.evaluateTargetPathForAPI('#Page:-Current');
        const pageName = libCommon.getPageName(pageProxy);
        return pageName;
    }

    /**
     * @param {IClientAPI} context
     * @param {Set<string>} assignments
     * @param {WCMApplicationPartner[] | WCMDocumentPartner[]} partners
     * @returns string
     */
    static GetAssignedToInfoValue(context, isAssignedToPartnerEnabled, partners) {
        if (!isAssignedToPartnerEnabled) {
            return '-';
        }
        const filteredPartners = (partners || []).filter((/** @type {WCMDocumentPartner | WCMApplicationPartner} */p) => p.PartnerFunction === PartnerFunction.getPersonnelPartnerFunction());
        if (libVal.evalIsEmpty(filteredPartners)) {
            return context.localizeText('unassigned');
        }
        return AssignedToLibrary.AssignedToPartnersLabel(context, filteredPartners);
    }

    static AssignedToPartnersLabel(context, filteredPartners) {
        return filteredPartners.map((/** @type {WCMDocumentPartner | WCMApplicationPartner} */ p) => {
            const partnerEmployeeName = p.Employee_Nav.EmployeeName;
            return p.PersonnelNum === libCommon.getPersonnelNumber() ? this.AssignedToMeLabel(context, partnerEmployeeName) : partnerEmployeeName;
        }).join(', ');
    }

    static AssignedToMeLabel(context, partnerEmployeeName) {
        return `${context.localizeText('me_label')} (${partnerEmployeeName})`;
    }

    static AddFilterCriteriaFromAssignedToFilters(context, formCellContainer, filterResults) {
        const results = [...filterResults];

        const assignedToFilterButtons = formCellContainer.getControl('AssignedToFilterButtons');
        if (assignedToFilterButtons.getVisible()) {
            results.push(assignedToFilterButtons.getValue());
        }

        const assignedToFilterListPkr = formCellContainer.getControl('AssignedToFilterListPkr');
        if (assignedToFilterListPkr.getVisible()) {
            const valueMap = new Map(assignedToFilterListPkr.getValue().map(item => [item.ReturnValue, item.DisplayValue]));
            if (valueMap.size) {
                results.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'AssignedToQuery', undefined, [...valueMap.keys()], true, undefined, [...valueMap.values()]));
            }
        }

        return results;
    }

    static CollectAssignedToSelectedItemsFromFilterCriteria(context, filterCriterias, partnersNav) {
        const formCellContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
        const assignedToListPkrControl = formCellContainer.getControl('AssignedToFilterListPkr');
        if (!assignedToListPkrControl.getVisible()) {
            return;
        }
        const filterCriteria = filterCriterias.find(({ type, filterItems }) => type === context.filterTypeEnum.Filter && !libVal.evalIsEmpty(filterItems) && filterItems[0].includes(partnersNav));
        if (!libVal.evalIsEmpty(filterCriteria)) {
            assignedToListPkrControl.setValue(filterCriteria.filterItems);
        }
    }
}

/**
 * @typedef TypeAssignedToBinding
 * @prop {string} PartnersNavPropName
 * @prop {Set<string>} assignmentTypes
 * @prop {{DisplayValue: string, ReturnValue: string}} AssignedToMePickerItem
 */
