import libThis from './FSMSmartFormsLibraryWindows';
import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import libPersona from '../../Persona/PersonaLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import Base64Library from '../../Common/Library/Base64Library';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libMeasure from '../../Measurements/MeasuringPointLibrary';
import NativeScriptObject from '../../Common/Library/NativeScriptObject';
import IsAndroid from '../../Common/IsAndroid';
import { GlobalVar } from '../../Common/Library/GlobalCommon';
import { Evaluator } from './FSMCalculationLibrary';
import isIOS from '../../Common/IsIOS';
import ruleEvaluator from './FSMFormFieldOnValueChange';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';
import IsWindows from '../../Common/IsWindows';

/*
* Contains all of the FSM Smartforms Feature related functions
*/
export default class FSMSmartFormsLibrary {
    constructor() {
        this.controlId = '';
        this.userValues = new Map();
        this.chapter = {};
        this.field = {};
        this.temp = '';
        this.translatedFields = new Map();
        this.values = new Map();
        this.visibilityRules = {};
        this.calculationRules = {};
        this.chapters = [];
        this.metadata = new Map();
        this.langaugeCode = 'en';
        this.chapterFields = {}; //Object containing chapters and array of fields (in order) under each chapter 
        
        this.parseMetadata = (event) => {
            switch (event.eventType) {
                // case xmlModule.ParserEventType.StartElement:
                //     if (event.elementName === 'Language') {
                //         this.metadata.set(event.position.line, this.langaugeCode);
                //     }
                //     break;
                // case xmlModule.ParserEventType.Text: {
                //     if (this.metadata.has(event.position.line)) {
                //         const significantText = event.data.trim();
                //         if (!ValidationLibrary.evalIsEmpty(significantText)) {
                //             this.metadata[event.position.line] = significantText;
                //             this.langaugeCode = significantText;
                //         }
                //     }
                //     break;
                //}
                default:
                    break;
            }
        };

        /* Method to parse values-1.xml file */
        this.parseValues = (event) => {
            switch (event.eventType) {
                // case xmlModule.ParserEventType.StartElement:
                //     if (event.attributes) {
                //         for (const attributeName in event.attributes) {
                //             if (event.attributes[attributeName].includes('chapter')) {
                //                 const strs = event.attributes[attributeName].split('.');
                //                 this.controlId = strs[strs.length - 2];
                //                 if (this.controlId.includes('stateElement')) {
                //                     this.controlId = this.controlId + strs[strs.length - 1];
                //                 }
                //                 this.attachmentPicker = false;
                //                 if (event.elementName === 'object-attachment') {
                //                     this.attachmentPicker = true;
                //                 }
                //             }
                //         }
                //     }

                //     break;
                // case xmlModule.ParserEventType.Text: {
                //     const significantText = event.data.trim();
                //     //attachment picker may have multiple attachments to 1 controlId, so use array within map
                //     if (significantText !== '') {
                //         if (!this.userValues.has(this.controlId)) {
                //             if (this.attachmentPicker) {
                //                 this.userValues.set(this.controlId, new Array(significantText));
                //             } else {
                //                 this.userValues.set(this.controlId, significantText);
                //             }
                //             break;
                //         }
                //         this.userValues.get(this.controlId).push(significantText);
                //     }
                //     break;
                // }
                default:
                    break;
            }
        };
        /* Method to parse translation.xml file */
        this.parseTranslation = (event) => {
            switch (event.eventType) {
                // case xmlModule.ParserEventType.StartElement: {
                //     if (event.attributes) {
                //         for (const attributeName in event.attributes) {
                //             if (event.attributes[attributeName].includes('chapter')) {
                //                 const strs = event.attributes[attributeName].split('.');
                //                 this.temp = strs[strs.length - 2] + '.' + strs[strs.length - 1]; //Translations can have multiple types per field (title, name, value)
                //             }
                //         }
                //     }
                //     break;
                // }
                // case xmlModule.ParserEventType.Text: {
                //     const significantText = event.data.trim();
                //     if (this.translatedFields.has(this.temp)) this.values.set(this.temp, significantText);
                //     else if (!this.translatedFields.has(this.temp) && significantText !== '') {
                //         this.translatedFields.set(this.temp, significantText);
                //     }

                //     break;
                // }
                default:
                    break;
            }
        };
        /* Method to parse template.xml file */
        this.parseTemplate = (event) => {
            switch (event.eventType) {
                // case xmlModule.ParserEventType.StartElement:
                //     if (event.attributes) {
                //         for (const attributeName in event.attributes) {
                //             if (event.elementName === 'chapter' && attributeName === 'elementID') {
                //                 let subChapter = (event.attributes[attributeName].match(/_/g) || []).length > 1; //If chapter name has 2 or more '_', it is a sub-chapter
                //                 this.chapter = {
                //                     chapterName: this.translatedFields.get(event.attributes[attributeName] + '.name'),
                //                     fields: [],
                //                     elementID: event.attributes[attributeName],
                //                     visibilityCondition: event.attributes.visibilityCondition,
                //                     isSubChapter: subChapter,
                //                 };
                //                 this.chapters.push(this.chapter);
                //                 if (this.chapter.visibilityCondition) {
                //                     let rule = libThis.convertToJsSyntax(this.chapter.visibilityCondition); //Convert operators to JavaScript syntax
                //                     this.visibilityRules[this.chapter.elementID] = {IsChapter: true, IsSubChapter: subChapter, Rule: rule};
                //                 }
                //             } else if (event.elementName === 'dropdown') {
                //                 if (attributeName === 'elementID') {
                //                     this.field = {
                //                         type: 'dropdown',
                //                         name: this.translatedFields.get(event.attributes[attributeName] + '.title'),
                //                         value: [],
                //                         options: [],
                //                         selectedIndex: event.attributes.selectedIndex,
                //                         elementID: event.attributes[attributeName],
                //                         readOnly: event.attributes.readOnly,
                //                         required: event.attributes.required,
                //                         visibilityCondition: event.attributes.visibilityCondition,
                //                     };
                //                 }
                //             } else if (event.elementName === 'option' && attributeName === 'elementID') {
                //                 //this.field.options.push(this.translatedFields.get(event.attributes[attributeName]));
                //                 this.field.options.push({Index: this.field.options.length, ReturnValue: event.attributes[attributeName], DisplayValue: this.translatedFields.get(event.attributes[attributeName] + '.value')});
                //             } else if (attributeName === 'elementID' && event.elementName !== 'chapter' && !Object.prototype.hasOwnProperty.call(this.field,'type')) {
                //                 this.field = {
                //                     type: event.elementName,
                //                     name: this.translatedFields.get(event.attributes[attributeName] + '.title'),
                //                     value: '',
                //                     valueExtra: this.translatedFields.get(event.attributes[attributeName] + '.value'),
                //                     elementID: event.attributes[attributeName],
                //                     multiline: event.attributes.multiline,
                //                     readOnly: event.attributes.readOnly,
                //                     required: event.attributes.required,
                //                     allowBarcode: event.attributes.allowBarcode,
                //                     min: event.attributes.min,
                //                     max: event.attributes.max,
                //                     minDecimals: event.attributes.minDecimals,
                //                     maxDecimals: event.attributes.maxDecimals,
                //                     allowOutOfRangeValues: event.attributes.allowOutOfRangeValues,
                //                     visibilityCondition: event.attributes.visibilityCondition,
                //                     coreType: event.attributes.type,
                //                     selectedIndex: event.attributes.selectedIndex, //stateElement
                //                     expression: event.attributes.expression,
                //                     signalWord: event.attributes.signalWord,
                //                     symbolLeft: event.attributes.symbolLeft,
                //                     symbolRight: event.attributes.symbolRight,
                //                 };
                //             } else if (event.elementName === 'attachment') {
                //                 this.field[attributeName] = event.attributes[attributeName];
                //             } else if (event.elementName === 'attachmentPicker') {
                //                 this.field[attributeName] = event.attributes[attributeName];
                //                 this.field.elementID = event.attributes.elementID;
                //             }
                //             if (Object.prototype.hasOwnProperty.call(this.field,'type') && attributeName === 'elementID' && this.field.type !== 'dropdown') {
                //                 this.field.name = this.translatedFields.get(event.attributes[attributeName] + '.title');
                //             }
                //         }
                //     }
                //     break;
                // case xmlModule.ParserEventType.EndElement: {
                //     if (event.elementName === 'dropdown') {
                //         this.chapters[this.chapters.length - 1].fields.push(this.field);
                //         if (this.field.visibilityCondition) {
                //             let rule = libThis.convertToJsSyntax(this.field.visibilityCondition); //Convert operators to JavaScript syntax
                //             this.visibilityRules[this.field.elementID] = {IsChapter: false, IsSubChapter: false, Rule: rule};
                //         }
                //         this.field = {};
                //     }
                //     break;
                // }
                // case xmlModule.ParserEventType.Text: {
                //     const significantText = event.data.trim();
                //     if (this.chapters.length > 0 && Object.prototype.hasOwnProperty.call(this.field,'type') && this.field.type !== 'dropdown') {
                //         this.field.value = significantText;
                //         this.chapters[this.chapters.length - 1].fields.push(this.field);
                //         if (this.field.visibilityCondition) {
                //             if (validControlTypes[this.field.type]) { //Ignore non-supported control types
                //                 let rule = libThis.convertToJsSyntax(this.field.visibilityCondition); //Convert operators to JavaScript syntax
                //                 this.visibilityRules[this.field.elementID] = {IsChapter: false, IsSubChapter: false, Rule: rule};
                //             }
                //         }
                //         if (this.field.type === 'calculation') { //Build calculation rules object
                //             this.calculationRules[this.field.elementID] = {Rule: this.field.expression};
                //         }
                //         this.field = {};
                //     }
                //     break;
                // }
                default:
                    break;
            }
        };
        this.onErrorCallback = (error) => {
            Logger.error('FSMForm', `Error: ${error.message}`);
        };
    }

/**
 * This function adds all the data from the JSON object into the userValues map
 * @param {*} obj JSON object from values.xml
 * @param {*} values the userValues Map() from the SmartForms object
 */
    valuesObj(obj, values) {
        if (obj.values.bool) {
            this.addDataToMap(obj.values.bool,values);
        }
        if (obj.values.number) {
            this.addDataToMap(obj.values.number,values);
        }
        if (obj.values.string) {
            this.addDataToMap(obj.values.string,values);
        }
    }

    /**
     * This function creates most of the template for the Smartform. It adds the chapters, the calculations, visibility rules 
     * @param {*} obj JSON object
     * @param {*} translations translations map
     * @param {*} values  user values map
     * @param {*} calculations calculations object
     * @param {*} visibilities visibilty rules object
     */
    template(obj, translations, values, calculations, visibilities) {
        //Check if it is multiple chapters on a form. If that's the case parse the array other wise parse the object
        if (obj.checklistTemplate.chapters && Array.isArray(obj.checklistTemplate.chapters.chapter) && obj.checklistTemplate.chapters.chapter.length > 0) {
            let chapters = obj.checklistTemplate.chapters.chapter;
            chapters.forEach(chapter => {
                this.createChapter(chapter, translations, values, calculations, visibilities);
            });
            
        } else if (obj.checklistTemplate.chapters && obj.checklistTemplate.chapters.chapter) {
            this.createChapter(obj.checklistTemplate.chapters.chapter, translations, values, calculations, visibilities);
        }
    }

    /**
     * This function adds all the controls and data on the chapter object
     * @param {*} chapter 
     * @param {*} validControlTypes 
     * @param {*} translations 
     * @param {*} values 
     * @param {*} calculations 
     * @param {*} visibilities 
     */
    createChapter(chapter, translations, values, calculations, visibilities) {
        let formFields = [];
        let subChapter = (chapter['@elementID'].match(/_/g) || []).length > 1; //If chapter name has 2 or more '_', it is a sub-chapter

        //Check if chapter has visibilty condition
        /* eslint-disable no-prototype-builtins */
        if (chapter.hasOwnProperty('@visibilityCondition') && libCom.isDefined(chapter['@visibilityCondition'])) {
            let rule = libThis.convertToJsSyntax(chapter['@visibilityCondition']);
            visibilities[chapter['@elementID']] = {IsChapter: true, IsSubChapter: subChapter, Rule: rule};
        }

        let chapterFieldOrder = this.chapterFields[chapter['@elementID']]; //Get all fields for this chapter
        if (chapterFieldOrder) {
            chapterFieldOrder.fields.forEach(tempField => { //Loop over all fields
                if (chapter.hasOwnProperty(tempField.type)) { //This field type exists in the chapter JSON (always should)
                    if (Array.isArray(chapter[tempField.type])) { //More than one field of this type exists in an array
                        let tempObj = chapter[tempField.type].find(t => t['@elementID'] === tempField.name); //Find the correct field in the array for this field type
                        if (tempObj) {
                            this.createChapterField(tempField.type, tempObj, formFields, translations, values, calculations, visibilities);
                        }
                    } else { //One field of this type exists (no array)
                        this.createChapterField(tempField.type, chapter[tempField.type], formFields, translations, values, calculations, visibilities);
                    }
                }
            });
        }
            
        /// after adding all valid controls add the fields under the proper chapter
        let chapterObj = {
            chapterName: this.translatedFields.get(chapter['@elementID'] + '.name'),
            fields: formFields,
            elementID: chapter['@elementID'],
            visibilityCondition: chapter['@visibilityCondition'],
            isSubChapter: subChapter,
        };

        //add the chapter object on the form
        this.chapters.push(chapterObj);

        //Handle sub-chapters if any exist
        if (chapter.chapter) {
            if (Array.isArray(chapter.chapter)) {
                chapter.chapter.forEach(tempChapter => { //Recursively create the sub-chapters
                    this.createChapter(tempChapter, translations, values, calculations, visibilities);
                });
            } else { //Single sub-chapter
                this.createChapter(chapter.chapter, translations, values, calculations, visibilities);
            }
        }
    }

    /**
     * Pop a chapter field onto the stack of controls for this page
     * @param {*} fieldType - Type of control 
     * @param {*} obj - JSON object for this control
     * @param {*} formFields 
     * @param {*} translations 
     * @param {*} values 
     * @param {*} calculations 
     * @param {*} visibilities 
     */
    createChapterField(fieldType, obj, formFields, translations, values, calculations, visibilities) {
        let options = [];
        let fieldValue;
        let field;

        ///Parse visibility conditions
        if (obj.hasOwnProperty('@visibilityCondition') && libCom.isDefined(obj['@visibilityCondition'])) {
            let rule = libThis.convertToJsSyntax(obj['@visibilityCondition']);
            visibilities[obj['@elementID']] = {IsChapter: false, IsSubChapter: false, Rule: rule};
        }

        if (obj.hasOwnProperty('@expression') && libCom.isDefined(obj['@expression'])) {
            calculations[obj['@elementID']] = {Rule: obj['@expression']};
        }

        //If the control is a dropdown parse all the options for the dropdown
        if (fieldType === 'dropdown' && obj.option) {
            if (Array.isArray(obj.option)) {
                obj.option.forEach(entry => {
                    options.push({Index: options.length, ReturnValue: entry['@elementID'], DisplayValue: this.translatedFields.get(entry['@elementID'] + '.value')});
                });
            } else {
                    options.push({Index: 0 , ReturnValue: obj.option['@elementID'], DisplayValue: this.translatedFields.get(obj.option['@elementID'] + '.value')});
            }
        }
        fieldValue = (fieldType === 'dropdown') ? [] : translations.get(obj['@elementID'] + '.value');
        ///If the field is a dropdown add the options that appear on the dropdown else build the field object with other properties
        field = (fieldType === 'dropdown') ?
        {
                type: 'dropdown',
                name:  translations.get(obj['@elementID'] + '.title'),
                value: fieldValue,
                options: options,
                selectedIndex: obj.hasOwnProperty('@selectedIndex')? obj['@selectedIndex'] : undefined,
                elementID: obj.hasOwnProperty('@elementID')? obj['@elementID'] :undefined,
                readOnly: obj.hasOwnProperty('@readOnly')? obj['@readOnly'] :undefined,
                required: obj.hasOwnProperty('@required')? obj['@required'] :undefined,
                visibilityCondition: obj.hasOwnProperty('@visibilityCondition')? obj['@visibilityCondition'] :undefined,
        }: {
            type: fieldType ? fieldType : undefined,
            name: translations.get(obj['@elementID'] + '.title'),
            value: values.has(obj['@elementID'] + '.value')? values.get(obj['@elementID'] + '.value') : '',
            valueExtra: translations.get(obj['@elementID'] + '.value'),
            elementID: obj.hasOwnProperty('@elementID')? obj['@elementID'] :undefined,
            multiline: obj.hasOwnProperty('@multiline')? obj['@multiline'] :undefined,
            readOnly: obj.hasOwnProperty('@readOnly')? obj['@readOnly'] :undefined,
            required: obj.hasOwnProperty('@required')? obj['@required'] :undefined,
            allowBarcode: obj.hasOwnProperty('@allowBarcode')? obj['@allowBarcode'] :undefined,
            min: obj.hasOwnProperty('@min')? obj['@min'] :undefined,
            max: obj.hasOwnProperty('@max')? obj['@max'] : undefined,
            minDecimals: obj.hasOwnProperty('@minDecimals')? obj['@minDecimals'] :undefined,
            maxDecimals: obj.hasOwnProperty('@maxDecimals')? obj['@maxDecimals'] :undefined,
            allowOutOfRangeValues: obj.hasOwnProperty('@allowOutOfRangeValues')? obj['@allowOutOfRangeValues'] :undefined,
            visibilityCondition: obj.hasOwnProperty('@visibilityCondition')? obj['@visibilityCondition'] :undefined,
            coreType: obj.hasOwnProperty('@coreType')? obj['@coreType'] :undefined,
            selectedIndex: obj.hasOwnProperty('@selectedIndex')? obj['@selectedIndex'] : undefined, //stateElement
            expression: obj.hasOwnProperty('@expression')? obj['@expression'] :undefined,
            signalWord: obj.hasOwnProperty('@signalWord')? obj['@signalWord'] :undefined,
            symbolLeft: obj.hasOwnProperty('@symbolLeft')? obj['@symbolLeft'] :undefined,
            symbolRight: obj.hasOwnProperty('@symbolRight')? obj['@symbolRight'] :undefined,
        };
        ///Add different properties if the control is an attachment or an attachment picker
        if (fieldType === 'attachment') {
            field.attachmentName = obj['@attachmentName'];
            field.attachmentID = obj['@attachmentID'];
        }
        if (fieldType === 'attachmentPicker') {
            field.allowedTypes = obj['@allowedTypes'];
        }
        //Add the control to the forms field array
        formFields.push(field);
    }

    /**
     * @param {*} obj JSON object 
     * @param {*} translatedFields the translation Map() on the Smartform object
     */
    translations(obj, translatedFields) {
        if (obj.translations.string) {
            this.addDataToMap(obj.translations.string,translatedFields);
        }
    }

    /**
     * Parse the template XML into an object keyed by chapter name, containing an array of fields under each chapter
     * Use this when creating each chapter page from JSON to keep proper field order
     */
    parseXMLIntoChapterFieldOrder(xml, context) {
        try { 
            let validControls = libThis.getSupportedSmartformControls(context);
            let chapters = xml.split('chapter elementID="');
        
            chapters.forEach(tempChapter => { //Loop over chapters
                let fields = tempChapter.split('><');
                let chapterObject = {};
                chapterObject.name = tempChapter.substring(0,tempChapter.search('"')).replace('"','');
                chapterObject.fields = [];
                fields.forEach(tempField => { //Loop over fields in this chapter
                    let fieldType = '';
                    if (tempField.search(' ') >= 0) {
                        fieldType = tempField.substring(0,tempField.search(' ')).replace('"','');
                    }
                    if (fieldType && validControls[fieldType]) { //This is a supported field type, so process and add to array
                        let tempArray = tempField.split('elementID="');
                        if (tempArray.length) {
                            let field = {};
                            field.name = tempArray[1].substring(0,tempArray[1].search('"')).replace('"','');
                            field.type = fieldType;
                            chapterObject.fields.push(field);
                        }
                    }
                });
                this.chapterFields[chapterObject.name] = chapterObject;
            });
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${err.message}`);
        }
    }

    /**
     * When chapter navigation is in process, disable all other nav controls
     * After the navigation completes, the controls will redraw with their correct enabled/visible states
     * @param {*} context 
     */
    static disableNavControls(context) {
        let control = libCom.getControlProxy(context, 'ChapterListPicker', 'FormCellSectionedTable');
        control.setEditable(false);
        libCom.enableToolBar(context, '', 'ToolbarItem1', false);
        libCom.enableToolBar(context, '', 'FlexibleSpaceRightTbI', false);
        libCom.enableToolBar(context, '', 'ToolbarItem0', false);
        context.setActionBarItemVisible('Cancel', false);
        context.setActionBarItemVisible('SaveDraft', false);
        context.getControl('FormCellSectionedTable').redraw();  
    }

    /**
     * A function that adds the data from JSON object to a map (Specific to forms)
     * @param {*} obj JSON object
     * @param {*} map any Map()
     */
     addDataToMap(obj, map) {
        if (Array.isArray(obj)) {
            obj.forEach(element => {
                if (!map.has(element['@key']) && libCom.isDefined(element['#text'])) {
                    if (element['@key'].includes('chapter')) {
                        let strs = element['@key'].split('.');
                        let textKey = strs[strs.length - 2] + '.' + strs[strs.length - 1]; //Translations can have multiple types per field (title, name, value)
                        map.set(textKey, element['#text']);
                    } else {
                        map.set(element['@key'], element['#text']);
                    }
                 }
            });
        } else {
            if (!map.has(obj['@key']) && libCom.isDefined(obj['#text'])) {
                if (obj['@key'].includes('chapter')) {
                    let strs = obj['@key'].split('.');
                    let textKey = strs[strs.length - 2] + '.' + strs[strs.length - 1]; //Translations can have multiple types per field (title, name, value)
                    map.set(textKey, obj['#text']);
                } else {
                    map.set(obj['@key'], obj['#text']);
                }
            }
        }
    }


    /**
     * Is the FSM Smartforms feature enabled in the backend?
     * @param {*} context
     */
    // This feature was manually disabled for 2305 release for S4 features.
    // Remove '&& IsS4ServiceIntegrationEnabled(context)' in the end of return in future releases to enable it.
    static isFSMSmartFormsFeatureEnabled(context) {
        return (libPersona.isFieldServiceTechnician(context) && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/FSMSmartForms.global').getValue()) && !IsS4ServiceIntegrationEnabled(context));
    }

    /**
     * Get query options to display smartforms for an operation
     * @param {*} context
     * @param {*} useQueryBuilder
     * @returns
     */
    static getOperationFSMFormsQueryOptions(context, useQueryBuilder=true) {
        if (useQueryBuilder) {
            let queryBuilder = context.dataQueryBuilder();
            queryBuilder.select('Description,Id,CreatePerson,Content,Template,FSMFormTemplate_Nav/Description,FSMFormTemplate_Nav/Name,WorkOrder,Operation,Mandatory,Closed');
            queryBuilder.filter("(WorkOrder eq '" + context.binding.OrderId + "' and Operation eq '" + context.binding.OperationNo + "')");
            queryBuilder.expand('FSMFormTemplate_Nav');
            queryBuilder.orderBy('WorkOrder,Operation,Description');
            return queryBuilder;
        }
        return "$filter=(WorkOrder eq '" + context.binding.OrderId + "' and Operation eq '" + context.binding.OperationNo + "')";
    }

    /**
     * Get query options to display all smartforms
     * @param {*} context
     * @param {*} useQueryBuilder
     * @returns
     */
    static getFSMFormsQueryOptions(context, useQueryBuilder=true) {
        if (useQueryBuilder) {
            let queryBuilder = context.dataQueryBuilder();
            queryBuilder.select('Description,Id,CreatePerson,Content,Template,FSMFormTemplate_Nav/Description,FSMFormTemplate_Nav/Name,WorkOrder,Operation,Mandatory,Closed');
            queryBuilder.expand('FSMFormTemplate_Nav');
            queryBuilder.orderBy('WorkOrder,Operation,Description');
            return queryBuilder;
        }
        return '';
    }

    /**
     *
     * @returns Map of patterns to search/replace for visibility rules
     */
    static getOperatorReplaceMap() {
        return {
            '\\s(=)\\s': ' === ',
            '\\s(<>)\\s': ' != ',
            '\\bnot isblank\\(': '!checklist_function_isblank(',
            '\\bisblank\\(': 'checklist_function_isblank(',
            '\\s(and)\\s': ' && ',
            '\\s(or)\\s': ' || ',
        };
    }

    /**
     * Calculates visibility condition of provided element based on it's visibility condition expression and values of related elements
     *
     * @return true if visibility condition is true, false otherwise
     */
    static calculateElementVisibility(context, control, rule, values, elements) {
        let result;
        let jsStatement;
        let expression;

        expression = libThis.replaceElementsWithValues(context, control, elements, values, rule);
        if (expression.includes('checklist_function_isblank')) {
            jsStatement = '"use strict"; function checklist_function_isblank(input) { return input === undefined || input.length === 0; }; return ' + expression;
        } else {
            jsStatement = 'return ' + expression;
        }
        try {
            result = Function(jsStatement)();
        } catch (err) {
            result = true;
        }
        return result;
    }

    /**
     * Goes over provided string and replaces checklist visibility condition operators to JS syntax:
     * - AND -> &&
     * - OR -> ||
     * - NOT -> !
     * - ISBLANK -> checklist_function_isblank
     * - = -> ===
     * This method doesn't replace those operators if they appear in double quoted strings, i.e.:
     * - textInput1 = "test and more" and numberInput1 = 1 -> textInput1 = "test and more" && numberInput1 === 1
     *
     * @param rule the visibility condition string
     * @return replaced expression
     */

    static convertToJsSyntax(rule) {
        const quotesPattern = /\"[^\"]+\"|([^\"]+)/g;
        const matcher = rule.match(quotesPattern);
        let newRule = '';

        for (const element of matcher) {
            if (element.search('\"') >= 0) { //this is string used to compare to element value - pass it as is
                newRule += element;
            } else {
                //this is part of expression syntax with operators and elements name, make it JS valid
                let jsSyntax = element.toLowerCase();
                let termsMap = libThis.getOperatorReplaceMap();
                for (const term in termsMap) { //Loop over all operator patterns that need to be replaced
                    let pattern = new RegExp(term,'ig');
                    let insideMatcher = jsSyntax.match(pattern);
                    if (insideMatcher) {
                        jsSyntax = jsSyntax.replace(pattern, termsMap[term]);
                    }
                }
                newRule += jsSyntax;
            }
        }
        return newRule;
    }

    /**
     * Replaces element references to it's real values, i.e.:
     * - expression = numberInput1 = 1 OR numberInput2 = 2
     * Then having values:
     * - numberInput1 = 1
     * - numberInput2 = 3
     * the result expression will be
     * - 1 = 1 OR 3 = 2
     *
     * @return replaced expression
     */
    static replaceElementsWithValues(context, control, elements, values, expression) {
        let newRule = expression;

        for (const elementName in elements) {  //All controls that are part of visibility rules
            if (libThis.areRelatedInsideSeries(control, elementName)) {
                newRule = libThis.replaceElementWithValue(context, newRule, elementName, values);
            }
        }
        return newRule;
    }

    /**
     * Replaces single element reference to it's real values, i.e.:
     * - expression = numberInput1 = 1 OR numberInput2 = 2
     * Then having values:
     * - numberInput1 = 1
     * - numberInput2 = 3
     * the result expression will be
     * - 1 = 1 OR numberInput2 = 2
     * This method uses Regex pattern to find exactly the referenced element name in the whole expression.
     *
     * @param expression the expression to replace
     * @param elementName the checklist element name
     * @param values dictionary of checklist element name/value pairs
     * @return replaced expression
     */
    static replaceElementWithValue(context, expression, elementName, values) {
        const pattern = new RegExp('\\b(' + elementName + ')\\b', 'ig');
        let matcher = expression.match(pattern);
        if (matcher) {
            let value = libThis.getValueFromElement(context, elementName, values);
            return expression.replace(pattern, value); //Matcher.quoteReplacement(value)?
        } else {
            return expression;
        }
    }

    /**
     * Returns value of element. In case it's TextInputChecklistElement it wraps the value with double quotes
     *
     * @param elementName the element for which we take the value
     * @param values dictionary of checklist element name/value pairs
     * @return value as string or UNDEFINED_JS_KEY constant if value was null
     */
    static getValueFromElement(context, elementName, values) {

        let value = '';
        let control = libCom.getControlProxy(context, elementName, 'FormCellSectionedTable');

        if (control) { //This control exists on this page, so get the value from the page also
                if (control.visible) { //Only evaluate the value if the control is visible
                    if (control._control.type === 'Control.Type.FormCell.ListPicker') { //Smartforms use index, not the actual return value text for visibility rules
                        let tempValue = control.getValue();
                        if (Array.isArray(tempValue) && tempValue.length === 1 && tempValue[0].SelectedIndex >= 0) {
                            value = values[elementName].Options[tempValue[0].ReturnValue].Index;
                        }
                    } else {
                        value = libCom.getControlValue(control);
                    }
                }
        } else { //Control is not on this page, so get it from control map
            if (Object.prototype.hasOwnProperty.call(values,elementName)) {
                if (values[elementName].IsVisible) { //Only evaluate the value if the control is visible
                    if (values[elementName].Type === 'dropdown') { //Look up the correct index for this drop down option
                        if (values[elementName].Value) {
                            value = values[elementName].Options[values[elementName].Value].Index;
                        }
                    } else {
                        value = values[elementName].Value;
                    }
                }
            }
        }
        if (!ValidationLibrary.evalIsEmpty(value)) {
            let controlType = values[elementName].Type;
            if (controlType === 'textinput' || controlType === 'note') {
                value = '\"' + libThis.convertNewLineToJsNewLine(value) + '\"';
            }
        } else {
            value = 'undefined';
        }
        return value;
    }

    /**
     * Examples:
     *
     * input from the user: "test"
     * java expression:
     * checklist_function_isblank("test")
     * result: OK
     *
     * input from the user: "test\ntest"
     * java expression:
     * checklist_function_isblank("test
     * test")
     * result: Invalid java script exception. Terminated string literal not found.
     *
     * Explanation:
     * In java script, if an expression is written on multiple lines the "\" should be used as a separator.
     * This method adds a "\" to any new line character from the user input.
     *
     * @param value - the value for which the new line should be processed.
     * @return a string which new line chars replaced with the new line used in JS.
     */
    static convertNewLineToJsNewLine(value) {
        let newLineMatch = /\\n/g;
        return value.replace(newLineMatch, '\\\n');
    }

    /**
     * Checks if 2 elements are related if they are inside series in the scope of replacing an element from an expression with its value.
     *
     * @param element        - the condition host element.
     * @param relatedElement - the element to check if it is related.
     * @return true in case the elements are related in same series or they are not inside any series, false otherwise.
     */
     static areRelatedInsideSeries() {
         return true;
     }

    /**
     * Save the current smart form page's values to memory
     * @param {*} context
     */
    static saveCurrentPageValues(context) {
        let pageControls = libCom.getControlDictionaryFromPage(context);
        let valueMap = libCom.getStateVariable(context, 'FSMFormInstanceControls');
        let value;
        let promises = [];
        for (const control in pageControls) {
            let savedControl = valueMap[this.getControlName(control)];
            if (savedControl) {
                if (pageControls[control].visible) { //Only save value if control is visible
                    switch (savedControl.Type) {
                        case 'numberinput':
                        case 'textinput':
                        case 'note':
                        case 'boolinput':
                        case 'dropdown':
                        case 'calculation':
                            value = libCom.getControlValue(pageControls[control]);
                            if (this.getProperString(savedControl.Value).toString() !== this.getProperString(value).toString()) {
                                savedControl.NeedsXMLUpdate = true;
                            }
                            savedControl.Value = value;
                            break;
                        case 'dateinput':
                            value = libCom.getControlValue(pageControls[control]);
                            if (this.getProperString(savedControl.Value) !== this.getProperString(value.toISOString())) {
                                savedControl.NeedsXMLUpdate = true;
                            }
                            savedControl.Value = value.toISOString();
                            break;
                        case 'stateElement':
                            if (control.includes('value')) {
                                value = this.getStatusForMachinesIndex(libCom.getControlValue(pageControls[control]));
                                if (this.getProperString(savedControl.Value.Value).toString() !== this.getProperString(value).toString()) {
                                    savedControl.NeedsXMLUpdate = true;
                                }
                                savedControl.Value.Value = value;
                            } else {
                                value = libCom.getControlValue(pageControls[control]);
                                if (this.getProperString(savedControl.Value.Comment) !== this.getProperString(value)) {
                                    savedControl.NeedsXMLUpdate = true;
                                }
                                savedControl.Value.Comment = value;
                            }
                            break;
                        case 'signature':
                            if (!ValidationLibrary.evalIsEmpty(pageControls[control].getValue())) {
                                if (savedControl.FileContent !== pageControls[control].getValue().content) { //Is signature content different from previously saved?
                                    const signatureControl = pageControls[control];
                                    let fileContent = Base64Library.transformBinaryToBase64(IsAndroid(context), signatureControl.getValue().content);
                                    let guid = context.mdkWindows.uuidModule.generateUuidV4();
                                    let objectId = context.getPageProxy().binding.Id;
                                    let objectType = 'CHECKLISTINSTANCE';
                                    if (this.ifMediaExist(context, savedControl.Value)) {
                                        //Skip for now.  Add better solution later
                                        //promises.push(this.deleteLocalMedia(savedControl.Value));
                                    }
                                    promises.push(this.createMediaSignature(context, fileContent, guid, savedControl, objectId, objectType, signatureControl));
                                }
                            }
                            break;
                        case 'attachmentPicker':
                            if (!ValidationLibrary.evalIsEmpty(pageControls[control].getValue())) {
                                    //check to see which attachments do not exist on saved control (null readLink). Create these attachments
                                    let attachmentArray = {};
                                    for (let item of pageControls[control].getValue()) {
                                        if (!item.readLink && typeof item !== 'string') {
                                            let guid = context.mdkWindows.uuidModule.generateUuidV4();
                                            if (attachmentArray[control]) {
                                                attachmentArray[control].push(guid);
                                            } else {
                                                attachmentArray[control] = [guid];
                                            }
                                            let objectId = context.getPageProxy().binding.Id;
                                            let objectType = 'CHECKLISTINSTANCE';
                                            let fileContent = '';
                                            //set the readLink value to 1 as an indicator that we have created this media
                                            item.readLink = 1;
                                            promises.push(this.createMedia(context, fileContent, guid, savedControl, objectId, objectType, item));
                                        }
                                    }
                                    //use a state variable to store id of attachments
                                    if (Object.keys(attachmentArray).length > 0) {
                                        libCom.setStateVariable(context, 'FSMFormAttachmentPickerSaveValues', attachmentArray);
                                    }
                                //}
                            }
                            break;
                        default: //SafetyLabel or unknown
                            break;
                    }
                }
            }
        }
        return Promise.all(promises).catch((err) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${err.message}`);
            context.getClientData().Error=context.localizeText('update_failed');
            context.executeAction('/SAPAssetManager/Actions/ErrorBannerMessage.action');
        });
    }

    /**
     * Validate required and numeric range fields for the current chapter
     * Set fields to display inline errors and prevent moving to another chapter
     * @param {*} context
     * @param {*} suppressErrors Do not display inline errors, only return success or failure
     */
    static ValidateCurrentPageValues(context, suppressErrors=false) {

        if (context.getPageProxy().binding.Closed) return true; // pass all the validation if form is closed

        let pageControls = libCom.getControlDictionaryFromPage(context);
        let valueMap = libCom.getStateVariable(context, 'FSMFormInstanceControls');
        let value;
        let validationSuccess = true;

        //Handle required fields
        for (const control in pageControls) {
            if (suppressErrors && !validationSuccess) break; //Do not process remaining controls if one has already failed
            if (Object.prototype.hasOwnProperty.call(pageControls[control]._control,'_validationProperties') && !pageControls[control]._control._validationProperties.ValidationViewIsHidden) { //Clear validation if it is shown currently
                pageControls[control].clearValidation();
            }
            let savedControl = valueMap[this.getControlName(control)];
            if (savedControl) {
                switch (savedControl.Type) {
                    case 'numberinput':
                    case 'textinput':
                    case 'note':
                    case 'boolinput':
                    case 'dropdown':
                    case 'dateinput':
                    case 'attachment':
                    case 'attachmentPicker':
                        value = libCom.getControlValue(pageControls[control]);
                        break;
                    case 'stateElement':
                        if (control.includes('value')) {
                            value = this.getStatusForMachinesIndex(libCom.getControlValue(pageControls[control]));
                        } else {
                            value = libCom.getControlValue(pageControls[control]);
                        }
                        break;
                    case 'signature': //Control value might be empty, so use the previously saved value
                        value = '';
                        if (!ValidationLibrary.evalIsEmpty(savedControl.Value) && libThis.isValidUUID(savedControl.Value)) {
                            value = savedControl.Value;
                        } else if (pageControls[control].getValue()) { //User just entered signature on this screen
                            value = pageControls[control].getValue();
                        }
                        break;
                    default:
                        break;
                }
                if (savedControl.Type === 'dateinput' && ValidationLibrary.evalIsEmpty(savedControl.Value) && savedControl.IsError && savedControl.IsVisible) {
                    //Date case will never be empty because MDK has no such concept, so we catch an empty date one time to alert user during submit
                    if (!suppressErrors) {
                        savedControl.IsError = false;
                        let message = context.localizeText('field_is_required');
                        libCom.setInlineControlError(context, pageControls[control], message);
                        pageControls[control]._control.context.clientAPI.applyValidation();
                    }
                    validationSuccess = false;
                } else if (savedControl.Required && savedControl.IsVisible && (savedControl.IsInvalidCalculation || ValidationLibrary.evalIsEmpty(value))) { //Only mark required as error if field is visible
                    if (!suppressErrors) {
                        savedControl.IsError = true;
                        let message = context.localizeText('field_is_required');
                        libCom.setInlineControlError(context, pageControls[control], message);
                        pageControls[control]._control.context.clientAPI.applyValidation();
                    }
                    validationSuccess = false;
                } else {
                    savedControl.IsError = false;
                }
            }
        }
        //Handle numeric fields
        for (const control in pageControls) {
            if (suppressErrors && !validationSuccess) break; //Do not process remaining controls if one has already failed
            let savedControl = valueMap[this.getControlName(control)];
            if (savedControl) {
                if (!savedControl.IsError) { //This field was already flagged as mandatory, so skip it
                    if (savedControl.Type === 'numberinput' && !savedControl.AllowOutOfRangeValues && savedControl.IsVisible) { //Only mark as error if field is visible
                        value = libCom.getControlValue(pageControls[control]);
                        if (libLocal.isNumber(context, value)) { //Only validate if a number has been entered in field
                            if (!libThis.ValidateLowerRange(context, value, savedControl.Min)) {
                                if (!suppressErrors) {
                                    savedControl.IsError = true;
                                    let message = context.localizeText('forms_numeric_min', [savedControl.Min]);
                                    libCom.setInlineControlError(context, pageControls[control], message);
                                    pageControls[control]._control.context.clientAPI.applyValidation();
                                }
                                validationSuccess = false;
                            } else if (!libThis.ValidateUpperRange(context, value, savedControl.Max)) {
                                if (!suppressErrors) {
                                    savedControl.IsError = true;
                                    let message = context.localizeText('forms_numeric_max', [savedControl.Max]);
                                    libCom.setInlineControlError(context, pageControls[control], message);
                                    pageControls[control]._control.context.clientAPI.applyValidation();
                                }
                                validationSuccess = false;
                            } else if (!libThis.ValidateMinDecimals(context, value, savedControl.MinDecimals)) {
                                if (!suppressErrors) {
                                    savedControl.IsError = true;
                                    let message = context.localizeText('forms_numeric_decimals_min', [savedControl.MinDecimals]);
                                    libCom.setInlineControlError(context, pageControls[control], message);
                                    pageControls[control]._control.context.clientAPI.applyValidation();
                                }
                                validationSuccess = false;
                            } else if (!libThis.ValidateMaxDecimals(context, value, savedControl.MaxDecimals)) {
                                if (!suppressErrors) {
                                    savedControl.IsError = true;
                                    let message;
                                    if (savedControl.MaxDecimals === '0') {
                                        message = context.localizeText('forms_numeric_integer');
                                    } else {
                                        message = context.localizeText('forms_numeric_decimals_max', [savedControl.MaxDecimals]);
                                    }
                                    libCom.setInlineControlError(context, pageControls[control], message);
                                    pageControls[control]._control.context.clientAPI.applyValidation();
                                }
                                validationSuccess = false;
                            }
                        }
                    }
                }
            }
        }
        let chaptersArray = libCom.getStateVariable(context, 'FSMFormInstanceChapters');
        let currentChapterIndex = libCom.getStateVariable(context, 'FSMFormInstanceCurrentChapterIndex') || 0;

        if (validationSuccess) { //Update the current chapter's state for progress extension
            if (chaptersArray[currentChapterIndex].state === 3) { //Error state = 3
                if (chaptersArray[currentChapterIndex].hasBeenVisited) {
                    chaptersArray[currentChapterIndex].state = 1;
                } else {
                    chaptersArray[currentChapterIndex].state = 0;
                }
            }
        } else {
            chaptersArray[currentChapterIndex].state = 3; //Set to Error state
        }
        return validationSuccess;
    }

    /**
     * Validate required and numeric range fields for the current chapter during submit
     * @param {*} context
     * @param {*} chapterControls - array of control names for current chapter
     */
    static ValidateChapterValuesDuringSubmit(context, chapterControls) {
        let value;
        let valueMap = libCom.getStateVariable(context, 'FSMFormInstanceControls');

        //Handle required fields
        for (const control of chapterControls) {
            let savedControl = valueMap[control];
            savedControl.IsError = false;
            switch (savedControl.Type) {
                case 'numberinput':
                case 'textinput':
                case 'note':
                case 'boolinput':
                case 'dropdown':
                case 'dateinput':
                case 'signature':
                case 'attachment':
                case 'attachmentPicker':
                    value = savedControl.Value;
                    break;
                case 'stateElement':
                    if (savedControl.Name.includes('value')) {
                        value = savedControl.Value.Value;
                    } else {
                        value = savedControl.Value.Comment;
                    }
                    break;
                default:
                    break;
            }
            if (savedControl.Required && savedControl.IsVisible && (savedControl.IsInvalidCalculation || ValidationLibrary.evalIsEmpty(value))) { //Ignore if not visible
                savedControl.IsError = true;
                return false; //Validation failed
            }
        }

        //Handle numeric fields
        for (const control of chapterControls) {
            let savedControl = valueMap[control];
            if (savedControl.Type === 'numberinput' && !savedControl.AllowOutOfRangeValues && savedControl.IsVisible) { //Only mark as error if field is visible
                value = savedControl.Value;
                if (libLocal.isNumber(context, value)) {
                    if (!libThis.ValidateLowerRange(context, value, savedControl.Min) || !libThis.ValidateUpperRange(context, value, savedControl.Max) || !libThis.ValidateMinDecimals(context, value, savedControl.MinDecimals) || !libThis.ValidateMaxDecimals(context, value, savedControl.MaxDecimals)) {
                        savedControl.IsError = true;
                        return false;
                    } 
                }
            }
        }
        return true; //All checks passed
    }

    /**
     * Validate that numeric value is >= defined lower range for smart form numeric field
     * @param {*} value
     * @param {*} lowerRange
     */
    static ValidateLowerRange(context, value, lowerRange) {
        if (libLocal.isNumber(context, lowerRange)) {
            return value >= libLocal.toNumber(context, lowerRange);
        }
        return true;
    }

    /**
     * Validate that numeric value is <= defined upper range for smart form numeric field
     * @param {*} value
     * @param {*} lowerRange
     */
    static ValidateUpperRange(context, value, upperRange) {
        if (libLocal.isNumber(context, upperRange)) {
            return value <= libLocal.toNumber(context, upperRange);
        }
        return true;
    }

    /**
     * Validate that numeric value is >= defined lower decimal range for smart form numeric field
     * @param {*} value
     * @param {*} lowerRange
     */
    static ValidateMinDecimals(context, value, lowerRange) {
        if (libLocal.isNumber(context, lowerRange)) {
            return libMeasure.evalPrecision(value) >= libLocal.toNumber(context, lowerRange);
        }
        return true;
    }

    /**
     * Validate that numeric value is <= defined upper decimal range for smart form numeric field
     * @param {*} value
     * @param {*} lowerRange
     */
    static ValidateMaxDecimals(context, value, upperRange) {
        if (libLocal.isNumber(context, upperRange)) {
            return libMeasure.evalPrecision(value) <= libLocal.toNumber(context, upperRange);
        }
        return true;
    }

    /**
     *
     * @param {*} context
     * @returns
     */
    static getFormActionBinding(context) {
        try {
            if (!ValidationLibrary.evalIsEmpty(context.getPageProxy().getActionBinding())) {
                return context.getPageProxy().getActionBinding();
            } else if (!ValidationLibrary.evalIsEmpty(context.getPageProxy().binding)) {
                return context.getPageProxy().binding;
            } else {
                return context.binding;
            }
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${err.message}`);
            return context;
        }
    }

    /**
     * Get hardcoded machine status. They are not translated
     * https://help.sap.com/docs/SAP_FIELD_SERVICE_MANAGEMENT/fsm_smartforms/status.html?q=smartform
     * @returns
     */
    static getStatusForMachines() {
        return ['OK', 'Needs attention', 'Spare parts', 'Readjusted', 'Not checked'];
    }

    /**
     * Get the actual FSM index for saving to XML
     * @param {*} status
     * @returns
     */
    static getStatusForMachinesIndex(status) {
        if (status) {
            return this.getStatusForMachines().indexOf(status);
        }
        return '';
    }

    /**
     * Redraw the previous and next buttons after a chapter's visibility has changed
     * @param {*} context
     */
    static redrawToolbarButtons(context) {
        context._page.getToolbar().then((toolbar) => {
            let toolbarItems = toolbar.getToolbarItems();
            for (let toolbarItem of toolbarItems) {
                if (toolbarItem.name === 'ToolbarItem0' || toolbarItem.name === 'ToolbarItem1') {
                    toolbarItem.redraw();
                }
            }
        });
    }

    /**
     * Set initial chapter visibility states so we can pass these to extension, and chapter selection picker
     * @param {*} context
     * @returns
     */
    static SetInitialChapterAndFieldVisibilityState(context, chapterArray) {

        let evaluateLoop;
        let ruleMap = libCom.getStateVariable(context, 'FSMFormInstanceVisibilityRules');
        let fieldValues = libCom.getStateVariable(context, 'FSMFormInstanceControls');
        let elementsInRules = libCom.getStateVariable(context, 'FSMFormInstanceControlsInVisibilityRules');

        do {
            evaluateLoop = false;
            for (const controlName in ruleMap) { //Loop over all rules
                if (ruleMap[controlName].IsChapter) {
                    let chapter = chapterArray[chapterArray.findIndex((row) => row.id === controlName)];
                    let visible = libThis.calculateElementVisibility(context.getPageProxy(), controlName, ruleMap[controlName].Rule, fieldValues, elementsInRules);
                    if (visible !== chapter.isVisible) {
                        chapter.isVisible = visible;
                        if (!chapter.isVisible) {
                            chapter.state = 4; //disabled
                        } else {
                            if (chapter.hasBeenVisited) {
                                chapter.state = 1;
                            } else {
                                chapter.state = 0;
                            }
                        }
                    }
                } else { //Handle regular fields.  Required so validation can later skip controls that are not visible
                    let oldVisible = fieldValues[controlName].IsVisible;
                    let visible = libThis.calculateElementVisibility(context.getPageProxy(), controlName, ruleMap[controlName].Rule, fieldValues, elementsInRules);
                    if (oldVisible !== visible) {
                        fieldValues[controlName].IsVisible = visible;
                        if (Object.prototype.hasOwnProperty.call(elementsInRules,controlName)) { //This field is referenced in other rules and visibility has changed, so re-run all validation rules
                            evaluateLoop = true;
                        }
                    }
                }
            }
        } while (evaluateLoop);
    }

    /**
     * Get Control Name
     */
    static getControlName(controlName) {
        if (controlName.includes('stateElement')) {
            return controlName.split('.')[0];
        }
        return controlName;
    }

    /**
     *
     * @param {*} page
     * @param {*} valueMap
     * @param {*} tempField
     */
    static getMediaControl(context, page, valueMap, tempField) {
        const id = valueMap[tempField.elementID].Value.replace(/[^A-Za-z0-9]+/g, '');
        const readLink = valueMap[tempField.elementID].ReadLink || 'FSMFormAttachments(\'' + id + '\')';
        let imageValue = '/SAPAssetManager/Services/AssetManager.service/' + readLink  + '/$value';
        const imageLocalPath = context.nativescript.fileSystemModule.path.join(context.nativescript.fileSystemModule.knownFolders.temp().path, valueMap[tempField.elementID].Value);
        if (this.ifMediaExist(context, valueMap[tempField.elementID].Value)) { // if file exists, use the local copy
            imageValue = imageLocalPath;
        }
        let title = tempField.attachmentName || tempField.name || '';
        page.Controls[0].Sections.push({
            '_Type': 'Section.Type.Image',
            'Image': imageValue,
            'IsVisible': true,
            'Title':title,
        });
        page.Controls[0].Sections.push({
            '_Type': 'Section.Type.FormCell',
            'Controls': [],
        });
    }

    /**
     * Create XML for the values.xml file using key and existing form controls
     * @param {*} key
     * @param {*} formControls
     * @returns
     */
    static createXMLString(key, formControls, formNameValueMap) {
        let xml = '';
        const lastChangedDateTime = 'last-changed-datetime=' + '"' + new Date().toISOString() + '"';
        const authorId = 'value-author-id=' + '"' + 'cloud(' + GlobalVar.getUserSystemInfo().get('FSM_EMPLOYEE') + ')' + '"';
        let value = formNameValueMap.get(key);
        if (formControls[key].Type === 'calculation') {
            if (formControls[key].IsInvalidCalculation || formControls[key].CalculationError) {
                value = ''; //Save empty for invalid calculations
            }
        }
        let type = key.split('.')[1]; // For state element, key would be stateElement.value or stateElement.comment, saving the .value or .comment so we can resuse it
        key = key.includes('stateElement') ? key.split('.')[0] : key;
        let chapter = formControls[key].Chapter.id;
        if (formControls[key].Chapter.isSubChapter) { //Sub-chapter controls need the parent chapter prefix
            let temp = chapter.split('_');
            chapter = temp[0] + '_' + temp[1] + '.' + chapter;
        }
        let chapterKey = 'key' + '=' + '"' + chapter + '.' + formControls[key].Name + '.value' + '"' + '>';
        let startTag = '';
        let endTag = '';
        switch (formControls[key].Type) {
            case 'numberinput':
            case 'dropdown':
                startTag =  '<number';
                endTag = '</number>';
                break;
            case 'textinput':
            case 'note':
            case 'calculation':
                startTag =  '<string';
                endTag = '</string>';
                break;
            case 'boolinput':
                startTag =  '<bool';
                endTag = '</bool>';
                break;
            case 'dateinput':
                startTag =  '<datetime';
                endTag = '</datetime>';
                break;
            case 'signature':
                startTag =  '<signature';
                endTag = '</signature>';
                break;
            case 'stateElement':
                if (type === 'value') {
                    startTag =  '<value';
                    endTag = '</value>';
                } else {
                    chapterKey = chapterKey.replace('.value', '.comment');
                    startTag =  '<string';
                    endTag = '</string>';
                }
                break;
            case 'attachmentPicker':
                startTag =  '<object-attachment attachmentPickerIndex=' + '\"' + (formControls[key].Name.slice(-1) - 1) + '\"';
                endTag = '</object-attachment>';
                //attachmentPicker uses .image instead of .value even for non image files
                chapterKey = chapterKey.replace('.value', '.image');
                //in case more than 1 attachment is added per picker
                for (let item of value) {
                    xml += startTag;
                    xml += ' ' + lastChangedDateTime + ' ' + authorId + ' ' + chapterKey + item;
                    xml += endTag + '\n';
                }
                return xml;
            default:
                break;
        }
        xml += startTag;
        xml += ' ' + lastChangedDateTime + ' ' + authorId + ' ' + chapterKey + value;
        xml += endTag;
        return xml;
    }

    /**
     * Check if the UUID is valid
     * @param {*} uuid
     * @returns
     */
    static isValidUUID(uuid) {
        let s = '' + uuid;
        s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
        return (s !== null);
    }

    /**
     * Save the locally created signature media on device temp storage
     * @param {*} context
     * @param {*} control
     */
    static saveMediaOnDeviceSignature(context, control) {
        let documentPath = context.nativescript.fileSystemModule.path.join(context.nativescript.fileSystemModule.knownFolders.temp().path, control.Value); // The value of the control is GUID and we are saving all the files using that
        let documentFileObject = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.File.fromPath(documentPath);
        let content = control.FileContent;
        documentFileObject.writeSync(content, () => {
            context.getClientData().Error=context.localizeText('create_document_failed');
            context.executeAction('/SAPAssetManager/Actions/ErrorBannerMessage.action');
            throw new Error();
        });
        return Promise.resolve();
    }

    /**
     * Save the locally created media on device temp storage
     * @param {*} context
     * @param {*} control
     */
    static saveMediaOnDevice(context, control) {
        for (let i = 0; i < control.Value.length; i++) {
            if (control.valueIndex >= 0) {
                control.valueIndex = control.valueIndex + 1;
                break;
            }
            if (!this.ifMediaExist(context, control.Value[i]) && !control.valueIndex) {
                control.valueIndex = i;
                break;
            }
        }
        let documentPath = context.nativescript.fileSystemModule.path.join(context.nativescript.fileSystemModule.knownFolders.temp().path, control.Description[control.valueIndex].slice(0, control.Description[control.valueIndex].lastIndexOf('.')), control.Description[control.valueIndex]);
        let documentFileObject = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.File.fromPath(documentPath);
        let content = control.FileContent;
        documentFileObject.writeSync(content, () => {
            context.getClientData().Error=context.localizeText('create_document_failed');
            context.executeAction('/SAPAssetManager/Actions/ErrorBannerMessage.action');
            throw new Error();
        });
        return Promise.resolve();
    }

    /**
     * Return a pointer to the progress tracker extension on the current smartform edit screen
     * @param {*} context
     * @returns
     */
    static getProgressExtensionControl(context) {
        return context.getPageProxy().getControl('FormCellSectionedTable').getSection('ProgressTrackerExtensionControl')._context.element._extensions[0];
    }

    /**
     * Check if media exists locally
     * @param {*} mediaID
     * @returns
     */
    static ifMediaExist(context,mediaID) {
        if (ValidationLibrary.evalIsEmpty(mediaID)) return false;
        const mediaLocalPath = context.nativescript.fileSystemModule.path.join(context.nativescript.fileSystemModule.knownFolders.temp().path, mediaID);
        return context.nativescript.fileSystemModule.File.exists(mediaLocalPath);
    }
    /**
     * Delete the local media before creating a new one
     * @param {*} mediaID
     * @returns
     */
    static deleteLocalMedia(context,mediaID) {
        if (ValidationLibrary.evalIsEmpty(mediaID)) return Promise.resolve();
        const mediaLocalPath = context.nativescript.fileSystemModule.path.join(context.nativescript.fileSystemModule.knownFolders.temp().path, mediaID);
        const mediaFile = context.nativescript.fileSystemModule.File.fromPath(mediaLocalPath);
        return mediaFile.remove();
    }

    /**
     *
     * @param {*} context
     * @param {*} fileContent
     * @param {*} guid
     * @param {*} savedControl
     * @param {*} objectId
     * @param {*} objectType
     * @param {*} signatureControl
     * @returns
     */
    static createMediaSignature(context, fileContent, guid, savedControl, objectId, objectType, signatureControl) {
        savedControl.Value = guid;
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Forms/FSM/FSMAttachmentCreate.action', 'Properties': {
            'Properties': {
                'DocumentId': guid,
                'FileContent': fileContent,
                'ObjectId': objectId,
                'ObjectType':objectType,
                'FileName': guid,
            },
            'Headers' : {
                'slug' : {
                    'DocumentId': guid,
                    'ObjectId': objectId,
                    'ObjectType':objectType,
                    'FileName': guid,
                },
                'transaction.omdo_id': '/SAPAssetManager/Rules/Forms/FSM/FSMSmartformAttachmentsOMDOHeader.js',
            },
            'Target': {
                'EntitySet' : 'FSMFormAttachments',
                'Service': '/SAPAssetManager/Services/AssetManager.service',

            },
            'Media': signatureControl.getValue(),
        }}).then((data) => {
            savedControl.ReadLink = data.data[0]; // save the readlink for next pass
            savedControl.FileContent = signatureControl.getValue().content;
            return this.saveMediaOnDeviceSignature(context, savedControl).then(() => {
                savedControl.NeedsXMLUpdate = true;
                return Promise.resolve();
            }).catch(() => {
                return Promise.reject();
            });
        });
    }

    /**
     *
     * @param {*} context
     * @param {*} fileContent
     * @param {*} guid
     * @param {*} savedControl
     * @param {*} objectId
     * @param {*} objectType
     * @param {*} control
     * @returns
     */
    static createMedia(context, fileContent, guid, savedControl, objectId, objectType, control) {
        //use array to handle multiple attachments for a single picker
        if (!savedControl.Value) {
            savedControl.Value = new Array();
        }
        if (!savedControl.Description) {
            savedControl.Description = new Array();
        }
        savedControl.Value.push(guid);
        let extension = 'PNG';
        let description = guid.replace(/[^A-Za-z0-9]+/g, '') + '.' + extension;
        //attachments must be saved with a description
        let media = control;
        if (savedControl.Type === 'attachmentPicker') {
            extension = control.urlString.slice(control.urlString.lastIndexOf('.') + 1, control.urlString.length);
            description = guid.replace(/[^A-Za-z0-9]+/g, '') + '.' + extension;
        }
        if (savedControl.Type === 'signature') {
            media = control.getValue();
            control.content = media.content;
        }
        savedControl.Description.push(description);
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Forms/FSM/FSMAttachmentCreate.action', 'Properties': {
            'Properties': {
                'DocumentId': guid.replace(/[^A-Za-z0-9]+/g, ''),
                'FileContent': fileContent,
                'ObjectId': objectId,
                'ObjectType':objectType,
                'FileName': guid,
                'Description': description,
            },
            'Headers' : {
                'slug' : {
                    'DocumentId': guid.replace(/[^A-Za-z0-9]+/g, ''),
                    'ObjectId': objectId,
                    'ObjectType':objectType,
                    'FileName': guid + '.' + extension,
                    'Type': extension,
                    'Description': description,
                },
                'transaction.omdo_id': '/SAPAssetManager/Rules/Forms/FSM/FSMSmartformAttachmentsOMDOHeader.js',
            },
            'Target': {
                'EntitySet' : 'FSMFormAttachments',
                'Service': '/SAPAssetManager/Services/AssetManager.service',

            },
            'Media': media,
        }}).then((data) => {
            savedControl.ReadLink = data.data[0]; // save the readlink for next pass
            savedControl.FileContent = control.content;
            return this.saveMediaOnDevice(context, savedControl).then(() => {
                savedControl.NeedsXMLUpdate = true;
                return Promise.resolve();
            }).catch(() => {
                return Promise.reject();
            });
        });
    }

    /**
     * Take a string and send an empty string if the existing value is undefined.
     * For pickers, the initial values would be undefined if nothing is selected
     * and we dont want to save that to xml
     * @param {*} value
     */
    static getProperString(value) {
        return ValidationLibrary.evalIsEmpty(value) ? '' : value;
    }
    /**
     * Take the prefix and path of the file and find if the file exist with
     * device locale and if not, use the language code from the metadata.xml
     * @param {*} context
     * @param {*} path
     * @param {*} prefix
     * @returns file name with correct locale
     */
    static getLocalizeFileName(context, path, prefix) {
        const deviceLocalFile = prefix + '-' + context.getLanguage() + '.xml';
        const deviceLocalFilePath = context.nativescript.fileSystemModule.path.join(path, deviceLocalFile);
        if (context.nativescript.fileSystemModule.File.exists(deviceLocalFilePath)) {
            return deviceLocalFile;
        } else {
            const metadataLanguageCode = libCom.getStateVariable(context, 'instanceLanguage');
            return prefix + '-' + metadataLanguageCode + '.xml';
        }

    }

    /**
     * Object containing list of smartform template control types that are supported in SAM
     * Used to exclude missing types for value map and visibility rules when parsing template XML
     * @returns
     */
    static getSupportedSmartformControls(context) {
        if (IsWindows(context)) {
            return {
                'numberinput': true,
                'textinput': true,
                'note': true,
                'label': true,
                'boolinput': true,
                'dropdown': true,
                'dateinput': true,
                'attachment': true,
                'signature': true,
                'stateElement': true,
                'calculation': true,
                'attachmentPicker': true,
                'safetyLabel': false, //Windows does not support this extension currently
            };
        } else {
            return {
                'numberinput': true,
                'textinput': true,
                'note': true,
                'label': true,
                'boolinput': true,
                'dropdown': true,
                'dateinput': true,
                'attachment': true,
                'signature': true,
                'stateElement': true,
                'calculation': true,
                'attachmentPicker': true,
                'safetyLabel': true,
            };
        }
    }

    /**
     * This runs once each time the Smartform is edited by user
     * Validates calculation integrity for all calculation fields on this Smartform
     * Calculations cannot have a cyclic dependency, meaning they cannot reference themselves, and a child calculation cannot reference the parent
     * Calculations cannot reference controls on other chapters
     */
    static checkInvalidCalculations(context) {
        let calculationFields = libCom.getStateVariable(context, 'FSMFormInstanceControlsInCalculations');
        let calculationMap = libCom.getStateVariable(context, 'FSMFormInstanceCalculationRules');
        let fieldsMap = libCom.getStateVariable(context, 'FSMFormInstanceControls');
        let usedControls;

        for (const controlName in calculationMap) { //Loop over all calculations
            usedControls = {}; //The control nodes we have already checked for this calculation
            let valid = libThis.validateCalculationIntegrity(context, controlName, calculationMap[controlName].Rule, calculationFields, fieldsMap, calculationMap, usedControls);
            if (!valid) {
                fieldsMap[controlName].IsInvalidCalculation = true; //This calculation has a problem
            }
        }
        for (const controlName in calculationMap) { //Loop over all calculations
            for (const childControl in calculationFields) { //Loop over all fields referenced in calculations
                if (fieldsMap[childControl].Type === 'calculation') {
                    const pattern = new RegExp('\\b(' + childControl + ')\\b', 'i');
                    if (calculationMap[controlName].Rule.match(pattern)) {
                        if (fieldsMap[childControl].IsInvalidCalculation) {
                            fieldsMap[controlName].IsInvalidCalculation = true; //Child calculation is invalid, so this parent is also invalid
                            fieldsMap[controlName].CalculationError = fieldsMap[childControl].CalculationError;
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     * Check to see if the parent calculation is referenced by any of the child calculations, or if it references itself, or if it references a different chapter
     * @param {*} context
     * @param {*} parentControl
     * @param {*} rule
     * @param {*} calculationFields
     * @param {*} fieldsMap
     * @param {*} calculationMap
     * @param {*} usedControls
     * @returns - Boolean is true if no errors during validation
     */
    static validateCalculationIntegrity(context, parentControl, rule, calculationFields, fieldsMap, calculationMap, usedControls) {
        let valid = true;

        for (const childControl in calculationFields) { //Loop over all fields referenced in calculations
            const pattern = new RegExp('\\b(' + childControl + ')\\b', 'i');
            if (fieldsMap[childControl].Type === 'calculation') {
                if (rule.match(pattern)) {
                    if (childControl === parentControl) { //This calculation references itself
                        valid = false;
                        fieldsMap[parentControl].CalculationError = context.localizeText('forms_calculation_cyclic_error');
                        break;
                    }
                    if (usedControls[childControl]) continue; //This child node was already checked earlier.  Avoid infinite loop
                    usedControls[childControl] = true;
                    //Recursively check the next child calculation
                    valid = libThis.validateCalculationIntegrity(context, parentControl, calculationMap[childControl].Rule, calculationFields, fieldsMap, calculationMap, usedControls);
                    if (!valid) break; //If bad result, exit the for loop
                }
            }
            //Web interface seems to allow this, but confirmed that it should not.  Android native app does not allow
            if (rule.match(pattern) && (fieldsMap[parentControl].ChapterIndex !== fieldsMap[childControl].ChapterIndex)) { //Chapters must match
                valid = false;
                fieldsMap[parentControl].CalculationError = context.localizeText('forms_calculation_error_chapter');
                break;
            }
        }
        return valid;
    }

    /**
     * Evaluate calculation fields for current chapter either when chapter is loaded or OnChange of a screen field that may be tied to a calculation
     * @param {*} context - Either the changed control, or the screen
     * @param {*} processAllRules - If true, then the chapter is being loaded so we process all calculations
     * @param {*} pattern - In the OnChange case, used to find calculations that are referenced by the changed control
     * @param {*} calculationMap - All calculations on this Smartform
     * @param {*} fieldValues - All fields on this Smartform
     * @param {*} elementsInCalculations - All control names that are used in calculations
     * @param {*} currentChapterIndex - current chapter
     */
    static evaluateCalculations(context, processAllRules, pattern, calculationMap, fieldValues, elementsInCalculations, currentChapterIndex) {
        for (const controlName in calculationMap) { //Loop over all calculations
            if (processAllRules || (!processAllRules && calculationMap[controlName].Rule.match(pattern))) {  //Is this control that just had a value change referenced in this rule?
                if (fieldValues[controlName].ChapterIndex === currentChapterIndex) { //Only concerned with calculation controls on this chapter, ignore others
                    let control = libCom.getControlProxy(context.getPageProxy(), controlName, 'FormCellSectionedTable');
                    if (control) {
                        try {
                            if (fieldValues[controlName].IsInvalidCalculation) {
                                throw new SyntaxError(); //Catch calculation fields that have a bad reference
                            }
                            let equation = libThis.replaceElementsWithValues(context.getPageProxy(), control, elementsInCalculations, fieldValues, calculationMap[controlName].Rule);
                            let evaluator = new Evaluator();
                            let result = evaluator.evaluate(equation);
                            fieldValues[controlName].IsInvalidCalculation = false;
                            fieldValues[controlName].CalculationError = '';
                            if (control.getValue() !== result) { //Only set if the calculated value has changed
                                control.setValue(result);
                                if (Object.prototype.hasOwnProperty.call(control._control,'_validationProperties') && !control._control._validationProperties.ValidationViewIsHidden) { //Clear validation if it is shown currently
                                    control.clearValidationOnValueChange();
                                }
                            }
                        } catch (e) { //Error during calculation
                            let errorMessage;

                            if (!fieldValues[controlName].CalculationError) {
                                errorMessage = context.localizeText('forms_calculation_error') + ' - ' + new Date().toString(); //Error resolving the calculation
                            } else {
                                errorMessage = fieldValues[controlName].CalculationError; //Invalid calculation reference (cyclic or wrong chapter)
                            }
                            if (control.getValue() !== errorMessage) {
                                control.setValue(errorMessage);
                                libCom.setInlineControlError(context, control, errorMessage);
                                control._control.context.clientAPI.applyValidation();
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Evaluate visibility rules for current chapter controls and all chapters, either when chapter is loaded or OnChange of a screen field that may be tied to a visibility rule
     * @param {*} context - Either the changed control, or the screen
     * @param {*} processAllRules - If true, then the chapter is being loaded so we process all calculations
     * @param {*} pattern  - In the OnChange case, used to find calculations that are referenced by the changed control
     * @param {*} ruleMap - All visibility rules on this Smartform
     * @param {*} fieldValues  - All fields on this Smartform
     * @param {*} elementsInRules - All control names that are used in visibility rules
     * @param {*} chapterArray - All chapters on this Smartform
     */
    static evaluateVisibilityRules(context, processAllRules, pattern, ruleMap, fieldValues, elementsInRules, chapterArray) {
        let extension;
        let recalculate = false;

        if (!processAllRules) { //Reset for user keystroke
            libCom.removeStateVariable(context, 'FSMVisibilityNeedsFocus');
            libCom.removeStateVariable(context, 'FSMVisibilityNeedsPickerRefresh');
        }

        for (const controlName in ruleMap) { //Loop over all rules
            if (processAllRules || (!processAllRules && ruleMap[controlName].Rule.match(pattern))) {  //Is this control that just had a value change referenced in this rule?
                if (ruleMap[controlName].IsChapter) {
                    let chapter = chapterArray[chapterArray.findIndex((row) => row.id === controlName)];
                    let visible = libThis.calculateElementVisibility(context.getPageProxy(), controlName, ruleMap[controlName].Rule, fieldValues, elementsInRules);
                    if (visible !== chapter.isVisible) {
                        chapter.isVisible = visible;
                        if (!chapter.isVisible) {
                            chapter.state = 4; //disabled
                        } else {
                            if (chapter.hasBeenVisited) {
                                chapter.state = 1;
                            } else {
                                chapter.state = 0;
                            }
                        }
                        libThis.redrawToolbarButtons(context.getPageProxy()); //Refresh the previous/next buttons

                        if (!IsWindows(context)) { //Windows has no progress extension
                            //Visibility changed, so Update the extension control with new chapter state
                            if (!extension) {
                                extension = libThis.getProgressExtensionControl(context);
                            }
                            let step = extension.getStep(chapter.index);
                            step.State = chapter.state;
                            extension.updateStep(step, chapter.index);
                        }

                        libCom.setStateVariable(context, 'FSMVisibilityNeedsPickerRefresh', true);
                        if (context.constructor.name !== 'PageProxy') { //This is a page control that user typed into
                            libCom.setStateVariable(context, 'FSMVisibilityNeedsFocus', true);
                        }
                    }
                } else { //Regular control - Only process this rule if rules's parent control exists on the current page
                    let control = libCom.getControlProxy(context.getPageProxy(), controlName, 'FormCellSectionedTable');
                    if (control) {
                        let oldVisible = control.visible;
                        let visible = libThis.calculateElementVisibility(context.getPageProxy(), controlName, ruleMap[controlName].Rule, fieldValues, elementsInRules);
                        if (visible !== oldVisible) { //Only redraw the field if the visibility state has changed
                            control.setVisible(visible);
                            fieldValues[controlName].IsVisible = visible;
                            if (Object.prototype.hasOwnProperty.call(elementsInRules,controlName)) { //This field is referenced in other rules
                                recalculate = true;
                            }
                            if (context.constructor.name !== 'PageProxy') { //This is a page control that user typed into
                                libCom.setStateVariable(context, 'FSMVisibilityNeedsFocus', true);
                            }
                        }
                    }
                }
            }
        }
        if (recalculate) { //A control changed visibility and that control is referenced in another rule, so rerun the visibility checks
            ruleEvaluator(context, true);
        } else { //We are done running rules, so reset the chapter picker and set control focus if necessary
            if (libCom.getStateVariable(context, 'FSMVisibilityNeedsPickerRefresh')) {
                //Reload the chapter picker to adjust options
                let picker = context.getPageProxy().getControl('FormCellSectionedTable').getControl('ChapterListPicker');
                picker.reset();
            }
            if (libCom.getStateVariable(context, 'FSMVisibilityNeedsFocus')) {
                if (isIOS(context.getPageProxy())) {
                    context.setFocus();
                }
            }
        }
    }
}
