import { DynamicPageGenerator } from '../FDC/DynamicPageGenerator';
import libCom from '../Common/Library/CommonLibrary';

export default function checklistViewNav(context) {

    const sectionData = [{
        '_Type': 'Section.Type.FormCell',
        '_Name': 'FormCellSection',
        'Target':
        {
            'EntitySet': 'ChecklistAssessmentQuestions',
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '$filter=ChecklistBusObject_Nav/Form_Nav/FormId eq \'{{#Property:FormId}}\'&$expand=FormQuestion_Nav,FormGroup_Nav,ChecklistBusObject_Nav/Form_Nav&$orderby=SortNumber',
        },
        'Controls': [
            {
                'Caption': '$(L,group)',
                '_Name': 'GroupSim',
                'Value': '{{#Property:FormGroup_Nav/#Property:ShortDescription}}',
                '_Type': 'Control.Type.FormCell.SimpleProperty',
                'IsEditable': false,
            },
            {
                '_Name': 'Question',
                '_Type': 'Control.Type.FormCell.Note',
                'IsAutoResizing': true,
                'Value': '{{#Property:FormQuestion_Nav/#Property:QuestionText}}',
                'IsEditable': false,
            },
            {
                'Caption': '$(L,answer)',
                'PickerPrompt': '{{#Property:FormQuestion_Nav/#Property:QuestionDesc}}',
                'Value': '{{#Property:SelectedAnswerOptionId}}',
                'AllowMultipleSelection': false,
                'AllowEmptySelection': true,
                'IsEditable': '/SAPAssetManager/Rules/Checklists/ChecklistUpdateAllowChecklistEdit.js',
                'IsPickerDismissedOnSelection': true,
                'IsSearchCancelledAfterSelection': true,
                'PickerItems':
                {
                    'DisplayValue': '{{#Property:ShortDescription}}',
                    'ReturnValue': '{OptionID}',
                    'Target': {
                        'EntitySet': '{{#Property:@odata.readLink}}/FormQuestion_Nav/AnswerHeader_Nav/AnswerOptions_Nav',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': '$orderby=SortNumber',
                    },
                },
                '_Name': 'AnswerLstPkr',
                '_Type': 'Control.Type.FormCell.ListPicker',
            },
            {
                'Caption': '$(L, note)',
                'PlaceHolder': '$(L,note)',
                '_Name': 'Comments',
                '_Type': 'Control.Type.FormCell.SimpleProperty',
                'Value': '{Comments}',
                'IsEditable': '/SAPAssetManager/Rules/Checklists/ChecklistUpdateAllowChecklistEdit.js',
                'OnValueChange': '/SAPAssetManager/Rules/Common/Validation/ResetValidationOnInput.js',
            },
        ],
    },
    {
        '_Type': 'Section.Type.FormCell',
        '_Name': 'FormCellSection',
        'Controls':
        [{
            'Title': '$(L,discard)',
            'OnPress': '/SAPAssetManager/Rules/Checklists/ChecklistDiscard.js',
            '_Type': 'Control.Type.FormCell.Button',
            'ButtonType': 'Text',
            'Semantic': 'Tint',
            '_Name': 'DiscardButton',
            'TextAlignment': '/SAPAssetManager/Rules/Common/Platform/ModalButtonAlign.js',
            'IsVisible': '/SAPAssetManager/Rules/Checklists/ChecklistAllowDiscard.js',
            'Styles': {
                'Value': 'ObjectCellStyleRed',
            },
        }],
    }];

    const pageOverrides = {
        'Caption': '{{#Property:ShortDescription}}',
        'OnLoaded': '/SAPAssetManager/Rules/Checklists/ChecklistUpdateTemplateOnLoaded.js',
        'OnActivityBackPressed': '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/CancelCheckOnBackNavAndroid.js',
        'ActionBar': {
            'Items': [
                {
                    'Position': 'left',
                    'SystemItem': 'Cancel',
                    'Caption': '$(L,cancel)',
                    'OnPress': '/SAPAssetManager/Rules/Common/CheckForChangesBeforeClose.js',
                },
                {
                    'Position': 'right',
                    'SystemItem': '$(PLT,\'Done\',\'\',\'\',\'Done\')',
                    'Text': '/SAPAssetManager/Rules/Common/Platform/DoneText.js',
                    'OnPress': '/SAPAssetManager/Rules/Checklists/ChecklistQuestionsUpdateNav.js',
                    'Visible': '/SAPAssetManager/Rules/Checklists/ChecklistUpdateAllowChecklistEdit.js',
                },
            ],
        },
    };

    const actionContext = context.getPageProxy().getActionBinding();
    const target = libCom.getAppParam(context, 'CHECKLISTS', 'CompletedStatusText');
    let result;

    if (actionContext) {
        const statusText = actionContext.StatusText;
        if (statusText && statusText.trim() === target) {
            result = false;
        } else {
            result = true;
        }
    } else {
        result = false;
    }

    libCom.setStateVariable(context, 'AllowChecklistEdit', result);

    let generator = new DynamicPageGenerator(context, null, sectionData, pageOverrides);
    generator.setPageName(libCom.getStateVariable(context, 'FDCPreviousPage'));
    return generator.navToPage();
}
