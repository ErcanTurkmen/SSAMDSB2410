
export default function GetPurchaseOrder(context) {
	if (context.binding.PurchaseOrder_Nav) {
		return context.binding.PurchaseOrder_Nav.PurchaseOrderId;
	}
}
