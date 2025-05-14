import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function InspectionCharacteristicsRecordDefectQueryOptions(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue())) {
        return '$expand=MasterInspCharLongText_Nav,MasterInspChar_Nav,NotifItems_Nav,EAMChecklist_Nav/MyWOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/Equipment_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=EAMChecklist_Nav/OperationNo,EAMChecklist_Nav/Equipment,EAMChecklist_Nav/FunctionalLocation,InspectionChar';
    } else {
        return '$expand=MasterInspCharLongText_Nav,MasterInspChar_Nav,NotifItems_Nav,InspectionPoint_Nav/WOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/Equip_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=InspectionPoint_Nav/OperationNo,InspectionPoint_Nav/EquipNum,InspectionPoint_Nav/FuncLocIntern,InspectionChar';
    }
}
