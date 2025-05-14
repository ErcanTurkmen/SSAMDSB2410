/**
 * Evaluates an arbitrary boolean expression.
 * Substitutions for equality/non-equality/greater/less-than must be done prior to calling this function.
 * PLEASE VERIFY ANY CHANGES WITH AARON RUDOLPH BEFORE ALTERING
 * @param {String} expr a boolean expression, i.e. true or false; true and !(false or true)
 * @returns {Boolean} result of expression
 */
export function evaluateBooleanExpression(expr) {
    let parens = /\(((?:true|false|and|or|!| )+)\)/;   // Regex for identifying parenthetical expressions
    let not = /!((?:true|false))/;                     // Regex for identifying NOT (not P)
    let and = /((?:true|false)) and ((?:true|false))/; // Regex for identifying AND (P and Q)
    let or = /((?:true|false)) or ((?:true|false))/;   // Regex for identifing OR (P or Q)

    if (expr !== 'true' && expr !== 'false') {
        if (parens.test(expr)) {
            // eslint-disable-next-line no-unused-vars
            let newExpr = expr.replace(parens, function(match, subExpr) {
                return evaluateBooleanExpression(subExpr);
            });
            return evaluateBooleanExpression(newExpr);
        } else if (not.test(expr)) {
            // eslint-disable-next-line no-unused-vars
            let newExpr = expr.replace(not, function(match, p) {
                return JSON.stringify(!JSON.parse(p));
            });
            return evaluateBooleanExpression(newExpr);
        } else if (and.test(expr)) {
            // eslint-disable-next-line no-unused-vars
            let newExpr = expr.replace(and, function(match, p, q) {
                return JSON.stringify(JSON.parse(p) && JSON.parse(q));
            });
            return evaluateBooleanExpression(newExpr);
        } else if (or.test(expr)) {
            // eslint-disable-next-line no-unused-vars
            let newExpr = expr.replace(or, function(match, p, q) {
                return JSON.stringify(JSON.parse(p) || JSON.parse(q));
            });
            return evaluateBooleanExpression(newExpr);
        } else {
            return expr;
        }
    }
    return JSON.parse(expr);
}


/**
 * Evaluates an arbitrary numerical expression following PEMDAS.
 * Variable substitutions must be done prior to calling this function. This is not an algebraic solver.
 * PLEASE VERIFY ANY CHANGES WITH AARON RUDOLPH BEFORE ALTERING
 * @param {String} expr a numerical expression, i.e. 5 + 2 or (3 * 5) / 6
 * @returns {Number} Result of evaluated expression
 */
export function evaluateExpression(expr) {
    let parens = /\(([0-9+\-*/\^ .]+)\)/;             // Regex for identifying parenthetical expressions
    let exp = /(-?\d+(?:\.\d+)?) ?\^ ?(-?\d+(?:\.\d+)?)/; // Regex for identifying exponentials (x ^ y)
    let mul = /(-?\d+(?:\.\d+)?) ?\* ?(-?\d+(?:\.\d+)?)/; // Regex for identifying multiplication (x * y)
    let div = /(-?\d+(?:\.\d+)?) ?\/ ?(-?\d+(?:\.\d+)?)/; // Regex for identifying division (x / y)
    let add = /(-?\d+(?:\.\d+)?) ?\+ ?(-?\d+(?:\.\d+)?)/; // Regex for identifying addition (x + y)
    let sub = /(-?\d+(?:\.\d+)?) ?- ?(-?\d+(?:\.\d+)?)/;  // Regex for identifying subtraction (x - y)

    if (isNaN(Number(expr))) {
        if (parens.test(expr)) {
            // eslint-disable-next-line no-unused-vars
            let newExpr = expr.replace(parens, function(match, subExpr) {
                return evaluateExpression(subExpr);
            });
            return evaluateExpression(newExpr);
        } else if (exp.test(expr)) {
            // eslint-disable-next-line no-unused-vars
            let newExpr = expr.replace(exp, function(match, base, pow) {
                return Math.pow(Number(base), Number(pow));
            });
            return evaluateExpression(newExpr);
        } else if (mul.test(expr)) {
            // eslint-disable-next-line no-unused-vars
            let newExpr = expr.replace(mul, function(match, a, b) {
                return Number(a) * Number(b);
            });
            return evaluateExpression(newExpr);
        } else if (div.test(expr)) {
            // eslint-disable-next-line no-unused-vars
            let newExpr = expr.replace(div, function(match, a, b) {
                if (b !== 0)
                    return Number(a) / Number(b);
                else
                    throw new Error('Division by zero');
            });
            return evaluateExpression(newExpr);
        } else if (add.test(expr)) {
            // eslint-disable-next-line no-unused-vars
            let newExpr = expr.replace(add, function(match, a, b) {
                return Number(a) + Number(b);
            });
            return evaluateExpression(newExpr);
        } else if (sub.test(expr)) {
            // eslint-disable-next-line no-unused-vars
            let newExpr = expr.replace(sub, function(match, a, b) {
                return Number(a) - Number(b);
            });
            return evaluateExpression(newExpr);
        } else {
            return expr;
        }
    }
    return Number(expr);
}
