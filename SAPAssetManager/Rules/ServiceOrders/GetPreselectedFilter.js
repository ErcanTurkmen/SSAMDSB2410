import S4ServiceLibrary from './S4ServiceLibrary';

export default function GetPreselectedFilter(context) {
    const filter = S4ServiceLibrary.getServiceOrdersFilterCriterias(context);
    return filter;
}
