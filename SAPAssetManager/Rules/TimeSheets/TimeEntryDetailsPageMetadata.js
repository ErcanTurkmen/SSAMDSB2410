/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import IsPMWorkOrderEnabled from '../UserFeatures/IsPMWorkOrderEnabled';
export default function TimeEntryDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/TimeSheets/TimeSheetEntryDetails.page');
    let dataTableSection = page.Controls[0].Sections[0];
    
    if (!IsPMWorkOrderEnabled(clientAPI)) {
        dataTableSection.Header.DataTable.Items = [
            {
                'Text': '$(L,name)',
                'TextAlignment': 'center',
                'Style': 'GridTableHeaderText',
            },
            {
                'Text': '$(L,abs_att)',
                'TextAlignment': 'center',
                'Style': 'GridTableHeaderText',
            },
            {
                'Text': '$(L,hours)',
                'TextAlignment': 'right',
                'Style': 'GridTableHeaderText',
            },
        ];
        dataTableSection.Row.Layout.ColumnWidth = [300,300,-1];
        dataTableSection.Row.Items = [
            {
                'Text' : '#Property:Employee/#Property:EmployeeName',
                'TextAlignment': 'center',
            },
            {
                'Text': '/SAPAssetManager/Rules/TimeSheets/Entry/View/TimeEntryViewAbsAttCode.js',
                'TextAlignment': 'center',
                'Style': 'GridTableRowText',
            },
            {
                'Text': '/SAPAssetManager/Rules/TimeSheets/Entry/View/TimeEntryViewHours.js',
                'TextAlignment': 'right',
                'Style': 'GridTableRowText',
            },
        ];
    }

    return page;
}
