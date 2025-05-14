import setAdhocGoodsTemplate from './SetAdhocGoodsTemplate';
import libCom from '../../Common/Library/CommonLibrary';
export default function SetAdhocStockTransfer(context) {
    //Set the global TransactionType variable to CREATE
    libCom.setOnCreateUpdateFlag(context, 'CREATE');
    return setAdhocGoodsTemplate(context, 'T');
}
