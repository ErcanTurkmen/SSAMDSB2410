import {ValueIfExists} from '../../Common/Library/Formatter';

export default function GetEmployeeResponsibleName(context) {
    const binding = context.binding;
    return binding.EmpResp_Nav ? `${binding.EmployeeResp} - ${binding.EmpResp_Nav.FullName}` : ValueIfExists(binding.EmployeeResp);
}
