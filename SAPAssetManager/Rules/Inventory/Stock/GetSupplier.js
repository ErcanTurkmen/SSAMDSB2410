/*Get the Supplier name */
import libCom from '../../Common/Library/CommonLibrary';
export default function StockDescription(context) {
   return (context.binding.Supplier) ? libCom.getVendorName(context, context.binding.Supplier) : '' ;
}

