/*
* Contains all of the FSM Calculation related classes
*/

/**
 * Used by the Parser class to scan a calculation string and create various tokens
 */
export class Lexer {

    constructor() {
        this.expression = '';
        this.index = 0;
        this.loop = true;
        this.marker = 0;
        this.length = 0;
        this.T = this.Token();
    }

    Token() {
        return {
            Operator: 'Operator',
            Identifier: 'Identifier',
            Number: 'Number',
        };
    }

    peekNextChar() {
        const idx = this.index;
        return ((idx < this.length) ? this.expression.charAt(idx) : '\x00');
    }

    getNextChar() {
        let ch = '\x00',
            idx = this.index;
        if (idx < this.length) {
            ch = this.expression.charAt(idx);
            this.index += 1;
        }
        return ch;
    }

    isWhiteSpace(ch) {
        return (ch === '\u0009') || (ch === ' ') || (ch === '\u00A0');
    }

    isLetter(ch) {
        return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
    }

    isDecimalDigit(ch) {
        return (ch >= '0') && (ch <= '9');
    }

    createToken(type, value) {
        return {
            type: type,
            value: value,
            start: this.marker,
            end: this.index - 1,
        };
    }

    skipSpaces() {
        while (this.index < this.length) {
            let ch = this.peekNextChar();
            if (!this.isWhiteSpace(ch)) {
                break;
            }
            this.getNextChar();
        }
    }

    scanOperator() {
        let ch = this.peekNextChar();
        if ('+-*/()^%=;,'.indexOf(ch) >= 0) {
            return this.createToken(this.T.Operator, this.getNextChar());
        }
        return undefined;
    }

    isIdentifierStart(ch) {
        return (ch === '_') || this.isLetter(ch);
    }

    isIdentifierPart(ch) {
        return this.isIdentifierStart(ch) || this.isDecimalDigit(ch);
    }

    scanIdentifier() {
        let ch = this.peekNextChar();
        if (!this.isIdentifierStart(ch)) {
            return undefined;
        }

        let id = this.getNextChar();
        while (this.loop) {
            ch = this.peekNextChar();
            if (!this.isIdentifierPart(ch)) {
                break;
            }
            id += this.getNextChar();
        }

        return this.createToken(this.T.Identifier, id);
    }

    checkIsNotDigit(ch) {
        return !this.isDecimalDigit(ch) && (ch !== '.');
    }

    checkNextCharIsE(ch) {
        return ch === 'e' || ch === 'E';
    }

    scanNumber() {
        let ch = this.peekNextChar();
        const isNotDigit = this.checkIsNotDigit(ch);
        if (isNotDigit) {
            return undefined;
        }

        let number = '';
        if (ch !== '.') {
            number = this.getNextChar();
            while (this.loop) {
                ch = this.peekNextChar();
                if (!this.isDecimalDigit(ch)) {
                    break;
                }
                number += this.getNextChar();
            }
        }

        if (ch === '.') {
            number += this.getNextChar();
            while (this.loop) {
                ch = this.peekNextChar();
                if (!this.isDecimalDigit(ch)) {
                    break;
                }
                number += this.getNextChar();
            }
        }

        const isNextCharE = this.checkNextCharIsE(ch);

        if (isNextCharE) {
            number += this.getNextChar();
            ch = this.peekNextChar();

            const values = this.handleEChar(ch, number);
            number = values.number;
        }

        if (number === '.') {
            throw new SyntaxError('Expecting decimal digits after the dot sign');
        }

        return this.createToken(this.T.Number, number);
    }

    handleEChar(prevChar, prevNumber) {
        let ch = prevChar;
        let number = prevNumber;
        if (ch === '+' || ch === '-' || this.isDecimalDigit(ch)) {
            number += this.getNextChar();
            while (this.loop) {
                ch = this.peekNextChar();
                if (!this.isDecimalDigit(ch)) {
                    break;
                }
                number += this.getNextChar();
            }
        } else {
            ch = 'character ' + ch;
            if (this.index >= this.length) {
                ch = '<end>';
            }
            throw new SyntaxError('Unexpected ' + ch + ' after the exponent sign');
        }
        return {ch, number};
    }

    reset(str) {
        this.expression = str;
        this.length = str.length;
        this.index = 0;
    }

    next() {
        this.skipSpaces();
        if (this.index >= this.length) {
            return undefined;
        }

        this.marker = this.index;

        let token = this.scanNumber();
        if (token) {
            return token;
        }

        token = this.scanOperator();
        if (token) {
            return token;
        }

        token = this.scanIdentifier();
        if (token) {
            return token;
        }
        throw new SyntaxError('Unknown token from character ' + this.peekNextChar());
    }

    peek() {
        let token;

        let idx = this.index;
        try {
            token = this.next();
            delete token.start;
            delete token.end;
        } catch (e) {
            token = undefined;
        }
        this.index = idx;

        return token;
    }
}

/**
 * Used by the Evaluator class to parse tokens created by the Lexer
 */
export class Parser {

    constructor() {
        this.lexer = new Lexer();
        this.T = this.lexer.Token();
        this.loop = true;
    }

    matchOp(token, op) {
        return (typeof token !== 'undefined') &&
            token.type === this.T.Operator &&
            token.value === op;
    }

    // ArgumentList := Expression |
    //                 Expression ',' ArgumentList
    parseArgumentList() {
        const args = [];

        while (this.loop) {
            let expr = this.parseExpression();
            if (typeof expr === 'undefined') {
                break;
            }
            args.push(expr);
            let token = this.lexer.peek();
            if (!this.matchOp(token, ',') && (!this.matchOp(token, ';'))) { //JCL -added semi.  Looks like Smartforms use both
                break;
            }
            this.lexer.next();
        }

        return args;
    }

    // FunctionCall ::= Identifier '(' ')' ||
    //                  Identifier '(' ArgumentList ')'
    parseFunctionCall(name) {
        let args = [];

        let token = this.lexer.next();
        if (!this.matchOp(token, '(')) {
            throw new SyntaxError('Expecting ( in a function call "' + name + '"');
        }

        token = this.lexer.peek();
        if (!this.matchOp(token, ')')) {
            args = this.parseArgumentList();
        }

        token = this.lexer.next();
        if (!this.matchOp(token, ')')) {
            throw new SyntaxError('Expecting ) in a function call "' + name + '"');
        }

        return {
            'FunctionCall': {
                'name': name,
                'args': args,
            },
        };
    }

    // Primary ::= Identifier |
    //             Number |
    //             '(' Assignment ')' |
    //             FunctionCall
    parsePrimary() {
        let token = this.lexer.peek();

        if (typeof token === 'undefined') {
            throw new SyntaxError('Unexpected termination of expression');
        }

        if (token.type === this.T.Identifier) {
            token = this.lexer.next();
            if (this.matchOp(this.lexer.peek(), '(')) {
                return this.parseFunctionCall(token.value);
            } else {
                return {
                    'Identifier': token.value,
                };
            }
        }

        if (token.type === this.T.Number) {
            token = this.lexer.next();
            return {
                'Number': token.value,
            };
        }

        if (this.matchOp(token, '(')) {
            this.lexer.next();
            const expr = this.parseAssignment();
            token = this.lexer.next();
            if (!this.matchOp(token, ')')) {
                throw new SyntaxError('Expecting )');
            }
            return {
                'Expression': expr,
            };
        }

        throw new SyntaxError('Parse error, can not process token ' + token.value);
    }

    // Unary ::= Primary |
    //           '-' Unary
    parseUnary() {
        let token = this.lexer.peek();
        if (this.matchOp(token, '-') || this.matchOp(token, '+')) {
            token = this.lexer.next();
            const expr = this.parseUnary();
            return {
                'Unary': {
                    operator: token.value,
                    expression: expr,
                },
            };
        }

        return this.parsePrimary();
    }

    // Multiplicative ::= Unary |
    //                    Multiplicative '*' Unary |
    //                    Multiplicative '/' Unary
    parseMultiplicative() {
        let expr = this.parseUnary();
        let token = this.lexer.peek();
        while (this.matchOp(token, '*') || this.matchOp(token, '/')) {
            token = this.lexer.next();
            expr = {
                'Binary': {
                    operator: token.value,
                    left: expr,
                    right: this.parseUnary(),
                },
            };
            token = this.lexer.peek();
        }
        return expr;
    }

    // Additive ::= Multiplicative |
    //              Additive '+' Multiplicative |
    //              Additive '-' Multiplicative
    parseAdditive() {
        let expr = this.parseMultiplicative();
        let token = this.lexer.peek();
        while (this.matchOp(token, '+') || this.matchOp(token, '-')) {
            token = this.lexer.next();
            expr = {
                'Binary': {
                    operator: token.value,
                    left: expr,
                    right: this.parseMultiplicative(),
                },
            };
            token = this.lexer.peek();
        }
        return expr;
    }

    // Assignment ::= Identifier '=' Assignment |
    //                Additive
    parseAssignment() {
        let expr = this.parseAdditive();

        if (typeof expr !== 'undefined' && expr.Identifier) {
            const token = this.lexer.peek();
            if (this.matchOp(token, '=')) {
                this.lexer.next();
                return {
                    'Assignment': {
                        name: expr,
                        value: this.parseAssignment(),
                    },
                };
            }
            return expr;
        }

        return expr;
    }

    // Expression ::= Assignment
    parseExpression() {
        return this.parseAssignment();
    }

    parse(expression) {
        this.lexer.reset(expression);
        const expr = this.parseExpression();

        const token = this.lexer.next();
        if (typeof token !== 'undefined') {
            throw new SyntaxError('Unexpected token ' + token.value);
        }

        return {
            'Expression': expr,
        };
    }

}

/**
 * Used by Evaluator class to handle custom constants and functions
 * This is general with Smartforms custom functions
 * Override Context and Evaluator classes to create different constants and functions if necessary for other purposes
 */
export class Context {

    constructor() {
        this.Constants = {
            /* eslint-disable no-loss-of-precision */
            pi: 3.1415926535897932384,
            phi: 1.6180339887498948482,
        };
        this.Functions = {
            abs: Math.abs,
            acos: Math.acos,
            asin: Math.asin,
            atan: Math.atan,
            ceil: Math.ceil,
            cos: Math.cos,
            exp: Math.exp,
            floor: Math.floor,
            random: Math.random,
            sin: Math.sin,
            sqrt: Math.sqrt,
            tan: Math.tan,
            //Smartform functions below
            avg: this.avg,
            min: this.min,
            max: this.max,
            power: this.power,
            round: this.round,
            rounddown: this.rounddown,
            roundup: this.roundup,
            sum: this.sum,
        };
    }

    /**
     * AVG function
     * @returns average of all summed arguments, rounded up to 5th decimal place
     */
    avg() {
        let value = 0;
        try {
            for (const element of arguments) {
                value = value + element;
            }
            value = Number(Math.ceil(Number(value / arguments.length + 'e5')) + 'e-5'); //Smartform code rounded up to 5 digits
        } catch (e) {
            throw new SyntaxError('AVG error: ' + e.message);
        }
        return value;
    }

    /**
     * MIN function
     * @returns minimum of all arguments
     */
    min() {
        let value;
        try {
            value = arguments[0];
            for (let i = 1; i < arguments.length; i++) {
                if (arguments[i] < value) {
                    value = arguments[i];
                }
            }
        } catch (e) {
            throw new SyntaxError('MIN error: ' + e.message);
        }
        return value;
    }

    /**
     * MAX function
     * @returns maximum of all arguments
     */
    max() {
        let value;
        try {
            value = arguments[0];
            for (let i = 1; i < arguments.length; i++) {
                if (arguments[i] > value) {
                    value = arguments[i];
                }
            }
        } catch (e) {
            throw new SyntaxError('MAX error: ' + e.message);
        }
        return value;
    }

    /**
     * POWER function
     * @returns 1st argument raised to the power of the 2nd argument
     */
    power() {
        let value = 0;
        try {
            value = Number(Math.pow(arguments[0], arguments[1]));
        } catch (e) {
            throw new SyntaxError('POWER error: ' + e.message);
        }
        return value;
    }

    /**
     * ROUND function
     * @returns rounded value of 1st argument, precision out to 2nd argument places
     */
    round() {
        let value = 0;
        try {
            value = Number(Math.round(Number(arguments[0] + 'e' + arguments[1])) + 'e-' + arguments[1]);
        } catch (e) {
            throw new SyntaxError('ROUND error: ' + e.message);
        }
        return value;
    }

    /**
     * ROUNDDOWN function
     * @returns rounded down value of 1st argument, precision out to 2nd argument places
     */
    rounddown() {
        let value = 0;
        try {
            value = Number(Math.floor(Number(arguments[0] + 'e' + arguments[1])) + 'e-' + arguments[1]);
        } catch (e) {
            throw new SyntaxError('ROUNDDOWN error: ' + e.message);
        }
        return value;
    }

    /**
     * ROUNDUP function
     * @returns rounded up value of 1st argument, precision out to 2nd argument places
     */
    roundup() {
        let value = 0;
        try {
            value = Number(Math.ceil(Number(arguments[0] + 'e' + arguments[1])) + 'e-' + arguments[1]);
        } catch (e) {
            throw new SyntaxError('ROUNDUP error: ' + e.message);
        }
        return value;
    }

    /**
    * SUM function
    * @returns sum of all arguments
    */
    sum() {
        let value = 0;
        try {
            for (const element of arguments) {
                value = value + element;
            }
        } catch (e) {
            throw new SyntaxError('SUM error: ' + e.message);
        }
        return value;
    }

}

/**
 * Used to resolve a calculation
 * Should be called from a SAM script
 * For example:
 * let equation = '1 + 2 + SUM(6,7,8)'
 * let evaluator = new Evaluator();
 * let result = evaluator.evaluate(equation);
 */
export class Evaluator {

    constructor(ctx) {
        this.parser = new Parser();
        this.context = (arguments.length < 1) ? new Context() : ctx;
    }

    exec(node) {
        let right, expr;

        if (Object.prototype.hasOwnProperty.call(node, 'Expression')) {
            return this.exec(node.Expression);
        }

        if (Object.prototype.hasOwnProperty.call(node, 'Number')) {
            return parseFloat(node.Number);
        }

        if (Object.prototype.hasOwnProperty.call(node, 'Binary')) {
            node = node.Binary;
            const left = this.exec(node.left);
            right = this.exec(node.right);
            switch (node.operator) {
                case '+':
                    return left + right;
                case '-':
                    return left - right;
                case '*':
                    return left * right;
                case '/':
                    return left / right;
                default:
                    throw new SyntaxError('Unknown operator ' + node.operator);
            }
        }

        if (Object.prototype.hasOwnProperty.call(node, 'Unary')) {
            node = node.Unary;
            expr = this.exec(node.expression);
            switch (node.operator) {
                case '+':
                    return expr;
                case '-':
                    return -expr;
                default:
                    throw new SyntaxError('Unknown operator ' + node.operator);
            }
        }

        if (Object.prototype.hasOwnProperty.call(node, 'Identifier')) {
            if (Object.prototype.hasOwnProperty.call(this.context.Constants, node.Identifier)) {
                return this.context.Constants[node.Identifier];
            }
            if (Object.prototype.hasOwnProperty.call(this.context.Variables, node.Identifier)) {
                return this.context.Variables[node.Identifier];
            }
            throw new SyntaxError('Unknown identifier');
        }

        if (Object.prototype.hasOwnProperty.call(node, 'Assignment')) {
            right = this.exec(node.Assignment.value);
            this.context.Variables[node.Assignment.name.Identifier] = right;
            return right;
        }

        if (Object.prototype.hasOwnProperty.call(node, 'FunctionCall')) {
            return this.execFunctionCall(node);
        }

        throw new SyntaxError('Unknown syntax node');
    }
    
    execFunctionCall(node) {
        const expr = node.FunctionCall;
        if (Object.prototype.hasOwnProperty.call(this.context.Functions, expr.name.toLowerCase())) {
            const args = [];
            for (const element of expr.args) {
                args.push(this.exec(element));
            }
            return this.context.Functions[expr.name.toLowerCase()].apply(null, args);
        }
        throw new SyntaxError('Unknown function ' + expr.name);
    }

    evaluate(expr) {
        const tree = this.parser.parse(expr);
        return this.exec(tree);
    }
}
