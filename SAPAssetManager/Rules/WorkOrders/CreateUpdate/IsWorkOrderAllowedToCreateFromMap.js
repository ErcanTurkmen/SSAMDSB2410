import EnableWorkOrderCreate from '../../UserAuthorizations/WorkOrders/EnableWorkOrderCreate';

export default function IsWorkOrderAllowedToCreateFromMap(context) {
   
    return EnableWorkOrderCreate(context);

}
