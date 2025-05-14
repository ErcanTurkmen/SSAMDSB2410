import OffsetODataDate from '../../Common/Date/OffsetODataDate';
import ODataDate from '../../Common/Date/ODataDate';
import { ProgressStates } from './WCMActivityTrackerStatusStepsData';

export default function WCMActivityTrackerSysStatusStepsData(context, filter = undefined) {
    return GetSystemStatusHistories(context, filter)
        .then(statuses => Array.from(statuses))
        .then(statuses => SortStatuses(context, statuses))
        .then(statuses => [statuses, CalculateActualSystemStatusStepIndex(context.binding.ActualSystemStatus, statuses)])
        .then(([statuses, selectedStepIndex]) => [
            statuses.map((status, i) => CreateTimelineStep(context, i !== selectedStepIndex ? ProgressStates.completed : ProgressStates.visitedButNotCompleted, status.SystemStatuses.StatusText, status.ChangeDate, status.ChangeTime)),
            selectedStepIndex])
        .then(([steps, selectedStepIndex]) => ({ SelectedStepIndex: selectedStepIndex, Steps: steps }));
}

function SortStatuses(context, statuses) {
    statuses.forEach(s => s.oDataDateTimestamp = new OffsetODataDate(context, s.ChangeDate, s.ChangeTime));
    const sortCriterias = [
        new SortCriteria((element) => element.oDataDateTimestamp.date(), true, (a, b) => !(a.oDataDateTimestamp.date() > b.oDataDateTimestamp.date() || a.oDataDateTimestamp.date() < b.oDataDateTimestamp.date())),  // sort by date
        new SortCriteria('StatusInact', false), // thenby statusInact
        new SortCriteria('Position'),  // thenby position
    ];
    statuses.sort((a, b) => SortBySortCriterias(a, b, sortCriterias));
    return statuses;
}

class SortCriteria {
    constructor(propNameOrGetter, isAscending = true, equalityOperator = undefined) {
        this.propertyGetter = typeof propNameOrGetter === 'string' ? (a) => propNameOrGetter.split('.').reduce((nestedObjPart, actualPropName) => nestedObjPart[actualPropName], a) : propNameOrGetter;
        this.operator = (a, b) => isAscending ? this.propertyGetter(a) > this.propertyGetter(b) : this.propertyGetter(a) < this.propertyGetter(b);
        this.equalityOperator = equalityOperator || ((a, b) => this.propertyGetter(a) === this.propertyGetter(b));
    }

    areEqual(a, b) {
        return this.equalityOperator(a, b);
    }
}

function SortBySortCriterias(a, b, sortCriterias) {
    return (sortCriterias.find(c => !c.areEqual(a, b))?.operator(a, b) ? 1 : -1) || 0;
}

function CalculateActualSystemStatusStepIndex(actualSystemStatus, statuses) {
    const selectedStepIndex = [...statuses].reverse().findIndex(s => s.SystemStatuses.SystemStatus === actualSystemStatus);
    return selectedStepIndex === -1 ? selectedStepIndex : statuses.length - 1 - selectedStepIndex;
}

function GetSystemStatusHistories(context, filter) {
    const filterTerm = filter ? `$filter=${filter}&` : '';
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/WCMSystemStatuses`, [], `${filterTerm}$expand=SystemStatuses&$select=ChangeDate,ChangeTime,SystemStatuses/StatusText,SystemStatuses/SystemStatus,Position,StatusInact`);
}

/**
 * @typedef TimelineStep
 * @prop {ProgressStates} State
 * @prop {string} Title
 * @prop {string} Subtitle
 * @prop {boolean} IsSelectable */

/** @returns {TimelineStep} */
export function CreateTimelineStep(context, state, title, changeDate, changeTime) {
    const odataDate = new OffsetODataDate(context, changeDate, changeTime);
    return {
        'State': state,
        'Title': title,
        'Subtitle': new ODataDate().toLocalDateString() === odataDate.toLocalDateString() ? `${context.localizeText('today_text')} ${context.formatTime(odataDate.date(), '', '', { format: 'short' })}` : context.formatDatetime(odataDate.date(), '', '', { format: 'short' }),
        'IsSelectable': false,
    };
}
