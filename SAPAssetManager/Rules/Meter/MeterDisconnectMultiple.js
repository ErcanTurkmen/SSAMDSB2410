import {DynamicPageGenerator} from '../FDC/DynamicPageGenerator';

/**
* FDC Replacement for Meter Disconnect/Reconnect
* @param {IClientAPI} context
*/
export default function MeterDisconnectMultiple(context) {
	const sectionData = [{
		'Target':
		{
			'EntitySet': 'DisconnectionObjects',
			'Service': '/SAPAssetManager/Services/AssetManager.service',
			'QueryOptions': '/SAPAssetManager/Rules/Meter/CreateUpdate/DisconnectMeterQueryOptions.js',
		},
		'Controls':
		[{
			'Caption': '$(L,serial_number)',
			'Value': '{{#Property:Device_Nav/#Property:Device}}',
			'IsEditable': false,
			'_Type': 'Control.Type.FormCell.SimpleProperty',
			'_Name': 'SerialNum',
		},
		{
			'Caption': '$(L,equipment)',
			'Value': '{{#Property:Device_Nav/#Property:EquipmentNum}}',
			'IsEditable': false,
			'_Type': 'Control.Type.FormCell.SimpleProperty',
			'_Name': 'EquipmentNum',
		},
		{
			'Caption': '$(L,document)',
			'Value': '{{#Property:DisconnectDoc_Nav/#Property:DocNum}}',
			'IsEditable': false,
			'_Type': 'Control.Type.FormCell.SimpleProperty',
			'_Name': 'Document',
		},
		{
			'Caption': '$(L,activity_type)',
			'Value': '{{#Property:DisconnectActivity_Nav/#Property:ActivityType}}',
			'IsEditable': false,
			'_Type': 'Control.Type.FormCell.SimpleProperty',
			'_Name': 'ActivityType',
		},
		{
			'Caption': '$(L,activity)',
			'Value': '{{#Property:DisconnectActivity_Nav/#Property:ActivityNum}}',
			'IsEditable': false,
			'_Type': 'Control.Type.FormCell.SimpleProperty',
			'_Name': 'Activity',
		},
		{
			'Caption': '$(L, status)',
			'AllowMultipleSelection': false,
			'IsPickerDismissedOnSelection': true,
			'IsVisible': '/SAPAssetManager/Rules/WorkOrders/Meter/DisconnectionTypeIsVisible.js',
			'PickerItems':
			{
				'DisplayValue' : '{{#Property:DisconnectionType}} - {{#Property:Description}}',
				'ReturnValue' : '{DisconnectionType}',
				'Target':
				{
					'EntitySet' : 'DisconnectionTypes',
					'Service' : '/SAPAssetManager/Services/AssetManager.service',
					'QueryOptions' : '$orderby=DisconnectionType',
				},
			},
			'_Type': 'Control.Type.FormCell.ListPicker',
			'_Name': 'TypeLstPkr',
		},
		{
			'Caption': '$(L, date)',
			'Mode' : 'Date',
			'_Type': 'Control.Type.FormCell.DatePicker',
			'_Name': 'DatePicker',
		},
		{
			'Caption': '$(L, time)',
			'Mode' : 'Time',
			'_Type': 'Control.Type.FormCell.DatePicker',
			'_Name': 'TimePicker',
		}],
		'_Type': 'Section.Type.FormCell',
	}];
	const pageOverrides = {
		'Caption': '/SAPAssetManager/Rules/Meter/CreateUpdate/MeterDisconnectReconnectAllCaption.js',
		'ActionBar':
		{
			'Items':
			[{
				'Position': 'left',
				'SystemItem': 'Cancel',
				'Caption': '$(L,cancel)',
				'OnPress': '/SAPAssetManager/Rules/Common/CheckForChangesBeforeClose.js',
			},
			{
				'Position': 'right',
				'SystemItem': "$(PLT,'Done','')",
				'Text': '/SAPAssetManager/Rules/Common/Platform/DoneText.js',
				'OnPress': '/SAPAssetManager/Rules/Meter/CreateUpdate/DisconnectAllMeters.js',
			}],
		},
	};
	let generator = new DynamicPageGenerator(context, null, sectionData, pageOverrides);

	return generator.navToPage();
}
