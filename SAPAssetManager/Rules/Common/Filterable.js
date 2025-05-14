/* eslint-disable no-unused-vars */
/**
 * Helper utility implementing MDK IFilterable
 * Use this as the Filterable object for FDC Filter actions
 * PLEASE CONSULT WITH AARON RUDOLPH BEFORE MAKING ANY CHANGES TO THIS FUNCTION
 * @param {IClientAPI} context
 */
 export function Filterable(context) {
    this._context = context;
    /**
     * Get defined sorter criteria based on the name
     * @param {String} name
     * @returns {FilterCriteria}
     */
    this.getSorterCriteria = function(name) {
        // no-op
        return null;
    };
    /**
     * @deprecated
     * Get defined filter criteria based on the name
     * @param {String} name
     * @param {Array<Object>} values
     * @param {Boolean?} isArrayFilterProperty
     * @returns {FilterCriteria}
     */
    this.getFilterCriteria = function(name, values, isArrayFilterProperty) {
        // no-op
        return null;
    };
    /**
     * Get defined filter criteria based on the name
     * @param {String} name
     * @param {Array<Object>} values
     * @param {Boolean?} isArrayFilterProperty
     * @returns {Promise<FilterCriteria[]> | Promise<Object[]>}
     */
    this.getFilterCriteriaAsync = function(name, values, isArrayFilterProperty) {
        return Promise.resolve(this._context.getClientData().FilterValues[name] || []);
    };
    /**
     * Set filter result with list of defined criteria
     * @param {Array<FilterCriteria>} result
     * @returns {*}
     */
    this.setFilterResult = function(result) {
        // no-op
        return null;
    };
    /**
     * Set filter result with list of defined criteria
     * @param {Array<FilterCriteria>} result
     * @returns {*}
     */
    this.standardFilterUpdated = function(result) {
        let filter = result.map(element => element._filterItems.reduce((accumulator, value) => accumulator.concat(`${element._name} eq '${value}'`), []).join(' or ')).filter(Boolean).map(e => `(${e})`).join(' and ');
        return {filter: filter, sorter: ''};
    };
    /**
     * Redraw Filter Feedback bar
     */
    this.redrawFilterFeedback = function() {
        // no-op
    };
    /**
     * Return selected list of filter criteria
     * @returns {Array<FilterCriteria>}
     */
    this.getSelectedValues = function() {
        // no-op
        return null;
    };
    /**
     * Return sorters managed on filter feedback bar of filterable object
     * @returns {String[]}
     */
    this.getFilterFeedbackSorters = function() {
        // no-op
        return null;
    };
    /**
     * Get filter value string based on the name and odata version 2 / 4
     * @param {String} name
     * @param {Object} value
     * @returns {String}
     */
    this.getFilterItemString = function(name, value) {
        // no-op
        return null;
    };
}
/* eslint-enable no-unused-vars */
