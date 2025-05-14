export default class {
    static isEditable(context, name) {
        if (context && Object.prototype.hasOwnProperty.call(context,'_control') && Object.prototype.hasOwnProperty.call(context._control,'_buttonContainer')) {
            return context._control._buttonContainer.isEditable(name);
        }
        return false;
    }

    static setEditable(context, name, isEditable) {
        if (context && Object.prototype.hasOwnProperty.call(context,'_control') && Object.prototype.hasOwnProperty.call(context._control,'_buttonContainer')) {
            context._control._buttonContainer.setEditable(name, isEditable);
        }
    }

    static getTitle(context, name) {
        if (context && Object.prototype.hasOwnProperty.call(context,'_control') && Object.prototype.hasOwnProperty.call(context._control,'_buttonContainer')) {
            return context._control._buttonContainer.getTitle(name);
        }
        return '';
    }

    static setTitle(context, name, title) {
        if (context && Object.prototype.hasOwnProperty.call(context,'_control') && Object.prototype.hasOwnProperty.call(context._control,'_buttonContainer')) {
            context._control._buttonContainer.setTitle(name, title);
        }
    }
}
