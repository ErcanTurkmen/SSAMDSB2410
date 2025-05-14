/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SysCompQueryptions() {
    return "$filter=SystemSettingGroup eq 'SYS.COMPONENT' and " +
            "(SystemSettingName eq 'S4CORE' or " +
            "SystemSettingName eq 'S4MERP' or " +
            "SystemSettingName eq 'SMERP' or " +
            "SystemSettingName eq 'IS-UT' or " +
            "SystemSettingName eq 'S4MISU' or " +
            "SystemSettingName eq 'SMISU' or " +
            "SystemSettingName eq 'SAP_BASIS' or " +
            "SystemSettingName eq 'SAP_GWFND')" +
            '&$orderby=SystemSettingGroup,SystemSettingName';
}
