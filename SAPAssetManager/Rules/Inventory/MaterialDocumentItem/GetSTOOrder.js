
export default function GetSTOOrder(context) {
	if (context.binding.STO_Nav) {
		return context.binding.STO_Nav.StockTransportOrderId;
	}
}
