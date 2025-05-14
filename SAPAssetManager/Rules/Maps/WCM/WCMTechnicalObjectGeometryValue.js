
export default function WCMTechnicalObjectGeometryValue(context) {
    const wcmApplication = context.binding;
    const equipGeometry = GetWorkPermitEquipmentGeometry(wcmApplication);
    const funclocGeometry = GetWorkPermitFuncLocGeometry(wcmApplication) || '';


    return equipGeometry ? equipGeometry : funclocGeometry;
}

function GetWorkPermitEquipmentGeometry(wcmApplication) {
    return wcmApplication &&
    wcmApplication.MyEquipments &&
    wcmApplication.MyEquipments.EquipGeometries &&
    wcmApplication.MyEquipments.EquipGeometries.length &&
    wcmApplication.MyEquipments.EquipGeometries[0].Geometry &&
    wcmApplication.MyEquipments.EquipGeometries[0].Geometry.GeometryValue;
}

function GetWorkPermitFuncLocGeometry(wcmApplication) {
    return wcmApplication &&
    wcmApplication.MyFunctionalLocations &&
    wcmApplication.MyFunctionalLocations.FuncLocGeometries &&
    wcmApplication.MyFunctionalLocations.FuncLocGeometries.length &&
    wcmApplication.MyFunctionalLocations.FuncLocGeometries[0].Geometry &&
    wcmApplication.MyFunctionalLocations.FuncLocGeometries[0].Geometry.GeometryValue;
}

