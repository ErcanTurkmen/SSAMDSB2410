/**
 *
 * @param {*} property a property (preferably a string) that will be evaluated for truthiness. See https://developer.mozilla.org/en-US/docs/Glossary/Truthy for reference
 * @param {String} placeholder a string that will be returned if the specified `property` evaluates to falsy
 * @param {Function?} formatFunc an optional format function that will be applied to the `property` being returned
 */
export function ValueIfExists(property, placeholder = '-', formatFunc = undefined) {
    if (property) {
        if (formatFunc) {
            return formatFunc(property);
        } else {
            return property;
        }
    } else {
        return placeholder;
    }
}
/**
 *
 * @param {*} property a property (preferably a string) that will be returned if `condition` evaluates to true/truthy
 * @param {*} placeholder a string that will be returned if the specified `condition` evaluates to false/falsy
 * @param {*} condition a condition specifying when `property` should be returned
 * @param {*} formatFunc an optional format function that will be applied to the `property` being returned
 */
export function ValueIfCondition(property, placeholder = '-', condition = undefined, formatFunc = undefined) {
    if (condition) {
        if (formatFunc) {
            return formatFunc(property);
        } else {
            return property;
        }
    } else {
        return placeholder;
    }
}

/**
 *
 * @param {*} property a UoM code for that a corresponding full value will be returned
 */
export function UOMCodeToValue(property) {
    switch (property) {
        case 'HR':
        case 'H':
            return '$(L,hours)';
        default:
            return property;
    }
}

/**
 * Formats id and description in one string
 * Returns only id if description is empty
 * 
 * @param {String} id
 * @param {String} description
 * 
 * @returns {String}
 */
export function FormatIdDescription(id, description) {
    if (id && description) {
        return id + ' - ' + description;
    } else if (description) {
        return description;
    }

    return ValueIfExists(id);
}
