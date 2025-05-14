
export default function ServiceOrderListViewOnReturning(context) {
    let sectionedTableProxy = context.getControls()[0];
    sectionedTableProxy.redraw();
}
