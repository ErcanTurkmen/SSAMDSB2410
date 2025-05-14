import { Application } from '@nativescript/core';
export default class MeasuringPointsEDTErrorHandler {

    constructor() {
        // object of errors {key: errorMessage}
        // the key is a combination of a section index, a row index and a cell name: 0-3-ValuationCode
        this.errors = {};
        this.warnings = {};
        
        this.sectionIndex = 0;
        this.rowIndex = 0;
    }

    getSectionIndex() {
        return this.sectionIndex;
    }

    setSectionIndex(index) {
        this.sectionIndex = index;
    }

    setRowIndex(index) {
        this.rowIndex = index;
    }

    generateKey(cellName) {
        if (!cellName) return '';
        return this.sectionIndex + '-' + this.rowIndex + '-' + cellName;
    }

    addErrorMessage(key, message) {
        this.errors[key] = message;
    }

    addWarningMessage(key, message) {
        this.warnings[key] = message;
    }

    hasErrors() {
        return !!Object.keys(this.errors).length;
    }

    hasWarnings() {
        return !!Object.keys(this.warnings).length;
    }

    hideErrors(sections) {
        for (let section of sections) {
            if (section._context.element.definition._data.Class === 'EditableDataTableViewExtension') {
                let sectionExtension = section.getExtension();

                if (sectionExtension) {
                    let cells = sectionExtension.getAllCells();
                    cells.forEach(cell => {
                        cell.clearValidation();
                    });
                }
            }
        }
    }

    hideErrorForCell(section, rowIndex, controlName) {
        let sectionExtension = section.getExtension();
     
        if (sectionExtension) {
            let cell = sectionExtension.getRowCellByName(rowIndex, controlName);
            if (cell) {
                cell.clearValidation();
            }
        }
    }

    hideWarningForCell(section, rowIndex, controlName) {
        let sectionExtension = section.getExtension();
        if (sectionExtension) {
            let cell = sectionExtension.getRowCellByName(rowIndex, controlName);
            if (cell) {
                if (Application.systemAppearance() === 'dark') {
                    cell.setStyle({ FontColor: 'FFFFFF' });
                } else {
                    cell.setStyle({ FontColor: '000000' });
                }
            }
        }
    }

    showWarningBanner(message, context) {
        const prefix = context.localizeText('warning');
        context.executeAction({
            'Name': '/SAPAssetManager/Actions/ErrorBannerMessage.action',
            'Properties': {
                'Message': prefix + ': ' + message,
                'Semantic': 'Warning',
            },
        });
    }

    showWarnings(sections, context) {
        Object.keys(this.warnings).forEach(warningKey => {
            let edtSectionIndex = Number(warningKey.split('-')[0]);
            let rowIndex = Number(warningKey.split('-')[1]);
            let controlName = warningKey.split('-')[2];
            let sectionIndex = (edtSectionIndex + 1) * 2;
            let section = sections[sectionIndex];
            let sectionExtension = section.getExtension();
            if (sectionExtension) {
                let cell = sectionExtension.getRowCellByName(rowIndex, controlName);
                if (cell) {
                    if (Application.systemAppearance() === 'dark') {
                        cell.setStyle({ FontColor: 'FDC036' });
                    } else {
                        cell.setStyle({ FontColor: 'E76500' });
                    }
                    this.showWarningBanner(this.warnings[warningKey], context);
                }
            }
        });
    }

    showErrors(sections) {
        Object.keys(this.errors).forEach(errorKey => {
            let edtSectionIndex = Number(errorKey.split('-')[0]);
            let rowIndex = Number(errorKey.split('-')[1]);
            let controlName = errorKey.split('-')[2];
            let sectionIndex = (edtSectionIndex + 1) * 2;
            let section = sections[sectionIndex];
            let sectionExtension = section.getExtension();
            
            if (sectionExtension) {
                let cell = sectionExtension.getRowCellByName(rowIndex, controlName);
                if (cell) {
                    cell.applyValidation(this.errors[errorKey]);
                }
            }
        });
    }
}
