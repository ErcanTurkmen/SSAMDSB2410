import GenerateLocalID from '../../../Common/GenerateLocalID';

export default function GetServiceConfirmationTranHistoriesLocalID(context) {
    return GenerateLocalID(context, 'S4ServiceConfirmationTranHistories', 'ObjectID', '00000', "$filter=startswith(ObjectID, 'LOCAL') eq true", 'LOCAL').then(id => {
        return id;
    });
}
