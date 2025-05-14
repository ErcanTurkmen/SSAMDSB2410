import IsAndroid from '../../Common/IsAndroid';
import IsIOS from '../../Common/IsIOS';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import MeterLibrary from '../Common/MeterLibrary';
import MetersCreateUpdateOnLoad from './MetersCreateUpdateOnLoad';
import IsMeterTakeReadingFlow from './IsMeterTakeReadingFlow';

export default function InstallMeterPageOnLoaded(context) {
    const INSTALL_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallEditMeterType.global').getValue();
    const INSTALL = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallMeterType.global').getValue();
    const REMOVE_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveEditMeterType.global').getValue();
    const REMOVE = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveMeterType.global').getValue();

    MetersCreateUpdateOnLoad(context);

    const meterTransactionType = MeterLibrary.getMeterTransactionType(context);
    const edtTable = CommonLibrary.getControlProxy(context, 'EditableDataTableExtensionSection');

    const isTakeSingleReading = IsMeterTakeReadingFlow(context);
    if (isTakeSingleReading) { 
        setTimeout(() => {
            updateReadingsTable(context, edtTable, context.binding.Device_Nav.RegisterGroup_Nav['@odata.readLink']);
        }, IsAndroid(context) ? 500 : 0);
    }

    if (meterTransactionType === INSTALL_EDIT || meterTransactionType === REMOVE || meterTransactionType === REMOVE_EDIT ) {
        setTimeout(() => {
            updateReadingsTable(context, edtTable, context.binding.Device_Nav.RegisterGroup_Nav['@odata.readLink']);
        }, IsAndroid(context) ? 500 : 0);
    } else if (meterTransactionType === INSTALL && IsAndroid(context)) {
        edtTable.setVisible(true);
        setTimeout(() => {
            edtTable.setVisible(false);
        }, 500);
    }
}

export function updateReadingsTable(context, table, parentEntityLink) {
    if (table.getExtension()) {
        table.getExtension().getParams().Target.EntitySet = parentEntityLink + '/Registers_Nav';
        table.getExtension().getParams().Target.QueryOptions = '$orderby=RegisterNum';

        const isTakeSingleReading = IsMeterTakeReadingFlow(context);
        if (isTakeSingleReading) {
            table.getExtension().getParams().Target.QueryOptions += `&$filter=RegisterNum eq '${context.binding.Register}'`;
        }

        
        if (IsIOS(context)) {
            table.getExtension().onCreate(); // reloading EDT items
        }

        context.count('/SAPAssetManager/Services/AssetManager.service', parentEntityLink + '/Registers_Nav', '').then(count => {
            try {
                const oneRowHeight = 70;
                const headerRowHeight = 90;
                table._control.builder.builtData.Height = headerRowHeight + (count * oneRowHeight);
            } catch (error) {
                Logger.error('updateReadingsTable', error);
            }

            table.redraw();
        });
    }
}
