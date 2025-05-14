/**
 * Generates FormCell section metadata for collecting data
 * Section bindings are saved on current (calling) page under ClientData.SectionBindings
 *
 * PLEASE CONSULT WITH AARON RUDOLPH BEFORE MAKING ANY CHANGES TO THIS FUNCTION
 * @constructor
 * @param {IClientAPI} context MDK Context
 * @param {String} templatePage Base page to override with computed section metadata. If not provided, defaults to '/SAPAssetManager/Pages/GenericPage.page'
 * @param {Array} sectionData Array containing section metadata
 * @param {Object} pageOverrides Object containing top-level MDK page properties to be overridden (i.e. toolbar, action items)
 * @param {Object?} additionalActionProperties Additional action properties such as ModalPage, ShowActivityIndicator, etc.
 * @param {Array?} additionalAllowedProperties Additional allowed properties for resolver
 */
export function DynamicPageGenerator(context, templatePage, sectionData, pageOverrides, additionalActionProperties, additionalAllowedProperties = []) {

    // Object construction
    this._context = context;
    this._sectionData = sectionData || [];
    this._templatePage = templatePage || '/SAPAssetManager/Pages/GenericPage.page';
    this._pageOverrides = pageOverrides || {};
    this._currentPageBinding = context.binding;
    this._binding = (() => {
        if (context.getPageProxy().getActionBinding) {
            return context.getPageProxy().getActionBinding() || context.binding;
        } else {
            return context.binding;
        }
    })();
    this._pageName = '';
    let self = this;
    let sectionCount = 0;

    // Table of properties we should resolve if seen
    const allowed_properties = [
        ...[
            'Title',
            'Caption',
            'Enabled',
            'IsVisible',
            'IsEditable',
            'HelperText',
            'PlaceHolder',
            'Value',
            'EntitySet',
            'QueryOptions',
            'HeadlineText',
            'BodyText',
            'Footnote',
            'StatusText',
            'PickerItems',
            'Segments',
        ],
        ...additionalAllowedProperties,
    ];

    /**
    * Build page dynamically and navigate
    * @returns {Promise} MDK navigation Action Result
    */
    this.navToPage = async function() {
        let actionProperties = {
            'PageMetadata': await getPageSections(),
            'PageToOpen': this._templatePage,
        };

        Object.assign(actionProperties, additionalActionProperties);

        // Reset binding back to its original state before navigating
        self._context._context.binding = this._currentPageBinding;
        if (this._pageName) {
            context.getPageProxy().evaluateTargetPathForAPI('#Page:' + this._pageName).getClientData().SectionBindings = self._context.getPageProxy().getClientData().SectionBindings;
        }
        return self._context.getPageProxy().executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericNav.action',
            'Properties': actionProperties,
            'Type': 'Action.Type.Navigation',
        });
    };

    /**
     * Builds nav action and page without navigation
     * ONLY USE THIS IF BINDINGS MAY CHANGE BETWEEN PAGE CREATION AND NAVIGATION (i.e. ClosePage)
     * Prefer using `navToPage()`
     * @returns {Promise<Object>} Generated action properties for navigation action override
     */
    this.buildPage = async function() {
        let actionProperties = {
            'PageMetadata': await getPageSections(),
            'PageToOpen': self._templatePage,
        };

        Object.assign(actionProperties, additionalActionProperties);

        // Reset binding back to its original state before navigating
        self._context._context.binding = self._binding;

        return actionProperties;
    };

    /**
     * @param {PageName} PageName to set the SectionBindings in the client data of the page
     */
    this.setPageName = async function(PageName) {
        this._pageName = PageName;
    };

    /**
    * Generates section data and returns as an Object
    * @returns {Promise<Object>} built page metadata
    */
    let getPageSections = async function() {
        // Save generated section bindings on current page's Client Data in case they need to be referenced
        self._context.getPageProxy().getClientData().SectionBindings = [];

        // Get Template Page definition
        let page = self._context.getPageProxy().getPageDefinition(self._templatePage);

        // Create a new sections array
        let sections = [];
        // Override page metadata as necessary
        Object.assign(page, self._pageOverrides);

        // Iterate through template sections and copy/create as necessary
        for (const element of self._sectionData) {
            await createSection(element).then((resultSections) => {
                resultSections.forEach(resultSection => sections.push(resultSection));
            });
        }
        page.Controls[0].Sections = sections;
        return page;
    };

    /**
     *
     * @param {Object} section JSON Metadata Section
     * @returns {Promise<Object>} JSON metadata section with values resolved against the sections' respective bindings
     */
    let createSection = async function(section) {
        if (Object.prototype.hasOwnProperty.call(section, 'Target')) {
            return processTarget(section.Target).then(target => {
                return self._context.read(target.Service, target.EntitySet, [], target.QueryOptions).then(async sectionBindings => {
                    let sections = [];
                    ///we need this to make it work on all 3 platforms
                    for (const sectionBinding of sectionBindings._array) {
                        self._context.getPageProxy().getClientData().SectionBindings[sectionCount++] = sectionBinding;
                        let newSection = JSON.parse(JSON.stringify(section));
                        delete newSection.Target;
                        sections.push(await resolveAsyncObject(newSection, sectionBinding, allowed_properties));
                    }
                    return sections;
                });
            });
        } else {
            sectionCount++;
            return [section];
        }
    };

    async function resolveAsyncObject(value, bindingObj, resolvableKeys) {
        let isPlainObject = function(_value) {
            return typeof value === 'object' &&
                _value !== null && _value !== undefined &&
                _value.constructor === Object;
        };
        // Await the value in case it's a promise.
        const resolved = await value;
        if (isPlainObject(resolved)) {
            const entries = Object.entries(resolved);
            // Recursively resolve object values.
            const resolvedEntries = entries.map(async ([key, _value]) => {
                if (resolvableKeys.includes(key) && !isPlainObject(_value)) {
                    self._context._context.binding = bindingObj;
                    _value = context.getDefinitionValue(_value);
                }
                return [key, await resolveAsyncObject(_value, bindingObj, resolvableKeys)];
            });
            /// Object.fromEntries() does not work in Chakra Javascript engine for Windows. Windows MDK recommended Array.from() instead
            return Array.from(await Promise.all(resolvedEntries)).reduce((acc, [key, val]) => Object.assign(acc, { [key]: val }), {});
        } else if (Array.isArray(resolved)) {
            // Recursively resolve array values.
            return Promise.all(resolved.map(e => resolveAsyncObject(e, bindingObj, resolvableKeys)));
        }
        return resolved;
    }

    /**
     * Resolves Target object for sections that include the directive
     * @param {Object} target MDK Target object to resolve
     * @returns {Object} resolved Target object given the page binding/action binding
     */
    let processTarget = async function(target) {
        // Ensure binding is set to ActionBinding, if applicable, before resolving anything
        self._context._context.binding = self._binding;
        // Resolve target values
        let keys = Object.keys(target);
        for (const element of keys) {
            target[element] = await self._context.getDefinitionValue(target[element]);
        }
        return target;
    };
    /**
    *
    * @returns {String} MDK reference page being overridden
    */
    this.getPageName = function() {
        return self._templatePage;
    };
}


/**
 * Helper utility for processing dynamic pages
 * PLEASE CONSULT WITH AARON RUDOLPH BEFORE MAKING ANY CHANGES TO THIS FUNCTION
 * @param {IClientAPI} context MDK Page context containing an FDC control built by DynamicPageGenerator
 */
/* eslint-disable no-unused-vars */
export function FDCSectionHelper(context) {

    this._context = context;
    this._sectionBindings = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings;
    this._fdcControl = context.getPageProxy().getControls()[0].sections;
    let self = this;

    /**
     * Function to be run for each FDC Section
     *
     * @callback FDCCallback
     * @param {Object} sectionBinding current binding for section
     * @param {SectionProxy} section current section
     * @param {Number} sectionIndex index of section
     * @returns {Promise<*> | *} result of callback
     */

    /**
     * Runs callback function for each section. Each callback is guaranteed to be in sequence
     * @param {FDCCallback} func function to run for each section.
     * @returns {Promise<Array>} Promise containing results of the function
     */
    this.run = async function(func) {
        let functionResults = [];

        for (let i = 0; i < self._sectionBindings.length; i++) {
            functionResults.push(await func(self._sectionBindings[i], self._fdcControl[i], i));
        }

        return Promise.all(functionResults);
    };

    /**
     * Return the current sextion index by looping through the section controls and compare the control proxy with the passed in context parameter
     * @param {clientapi} clientapi of the control
     * @returns {json} index & binding of the section
     */
    this.findSection = function(clientapi) {
        let sections = clientapi.getPageProxy().getControls()[0].sections;
        let section = {};
        for (let index = 0; index < sections.length; index++) {
            let controls = sections[index]._context.element._controls;
            for (const element of controls) {
                if (element.controlProxy === clientapi) {
                    section = {
                        'index': index,
                        'binding': clientapi.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings[index],
                    };
                    return section;
                }
            }
        }
        return -1;
    };

    /**
     * Return the current sextion index by looping through the section binding and comparing with the binding parameter
     * @param {binding} binding of the section.
     * @returns {int} index of the section
     */
    this.findSectionWithbinding = function(binding) {
        this._sectionBindings = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings;
        for (let index = 0; index < this._sectionBindings.length; index++) {
            if (binding['@odata.readLink'] === this._sectionBindings[index]['@odata.readLink']) {
                return index;
            }
        }
        return -1;
    };

}

/**
 * Helper function -- gets current Section for control
 * @param {IFormCellProxy} context control to get parent section
 * @returns {ISectionProxy} current section `control` resides in
 */
export function GetSectionForControl(context) {
    return context.getPageProxy().getControls()[0].getSections().find(section => section.getControls().some(control => control === context));
}

/**
 * Helper utility implementing MDK IFilterable
 * Use this as the Filterable object for FDC Filter actions
 * PLEASE CONSULT WITH AARON RUDOLPH BEFORE MAKING ANY CHANGES TO THIS FUNCTION
 * @param {IClientAPI} context
 */
export function FDCFilterable(context) {
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
        if (this._context.getClientData().FilterValues) {
            return Promise.resolve(this._context.getClientData().FilterValues[name] || []);
        } else {
            return Promise.resolve([]);
        }
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
        return { filter: filter, sorter: '' };
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
