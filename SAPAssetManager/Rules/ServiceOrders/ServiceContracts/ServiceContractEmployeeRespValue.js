
export default function ServiceContractEmployeeRespValue(context) {
    const employeeResp = context.binding.EmpResp_Nav;
    if (employeeResp) {
        return employeeResp.FullName || employeeResp.FirstName + ' ' + employeeResp.LastName || '-';
    } else {
        return '-';
    }
}
