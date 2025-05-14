import S4ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';

export default function ServiceRequestEmployeeResponsible(context) {
    const employee = S4ServiceRequestControlsLibrary.getEmployeeResponsible(context);
    return employee;
}
