import PersonaLibrary from '../../Persona/PersonaLibrary';
import FastFiltersWithStatuses, { STATUS_FAST_FILTERS, STATUS_FILTER_GROUP } from '../FastFiltersWithStatuses';
import CommonLibrary from '../../Common/Library/CommonLibrary';

const ASSIGNMENT_TYPE_1 = '1';
const ASSIGNMENT_TYPE_2 = '2';
const ASSIGNMENT_TYPE_6 = '6';
const ASSIGNMENT_TYPE_8 = '8';

const MANDATORY_FILTER_GROUP = 'mandatory';

const SMARTFORM_FAST_FILTERS = {
    'OPTIONAL': 'FILTER_OPTIONAL',
    'MANDATORY': 'FILTER_MANDATORY',
};

export default class SmartFormFastFilters extends FastFiltersWithStatuses {

    constructor(context) {
        const config = {
            statusProperty: 'Closed',
            mandatoryPropery: 'Mandatory',
        };
        const filterPageName = 'FSMFilterPage';
        const listPageName = 'FSMSmartFormsInstancesListViewPage';
        super(context, filterPageName, listPageName, config);

        this.setNewFilterCaption(SMARTFORM_FAST_FILTERS.OPTIONAL, context.localizeText('optional'));
        this.setNewFilterCaption(SMARTFORM_FAST_FILTERS.MANDATORY, context.localizeText('mandatory'));
    }

    getFastFilters(context) {
        return [
            { name: STATUS_FAST_FILTERS.STATUS_OPEN, value: this._getOpenFilterItemReturnValue(), property: this.config.statusProperty, group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_COMPLETED, value: this._getCompletedFilterItemReturnValue(), property: this.config.statusProperty, group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
            { name: SMARTFORM_FAST_FILTERS.OPTIONAL, value: this._getOptionalFilterItemReturnValue(), property: this.config.mandatoryPropery, group: MANDATORY_FILTER_GROUP, visible: this.isMandatoryFilterVisible(context) },
            { name: SMARTFORM_FAST_FILTERS.MANDATORY, value: this._getMandatoryFilterItemReturnValue(), property: this.config.mandatoryPropery, group: MANDATORY_FILTER_GROUP, visible: this.isMandatoryFilterVisible(context) },
        ];
    }

    isStatusFilterVisible(context) {
        const woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        return PersonaLibrary.isFieldServiceTechnician(context) && [ASSIGNMENT_TYPE_1, ASSIGNMENT_TYPE_6, ASSIGNMENT_TYPE_2, ASSIGNMENT_TYPE_8].includes(woAssignmentType);
    }

    isMandatoryFilterVisible(context) {
        this.isStatusFilterVisible(context);
    }

    _getOptionalFilterItemReturnValue() {
        return 'false';
    }

    _getMandatoryFilterItemReturnValue() {
        return 'true';
    }

    _getCompletedFilterItemReturnValue() {
        return 'true';
    }

    _getOpenFilterItemReturnValue() {
        return 'false';
    }
}
