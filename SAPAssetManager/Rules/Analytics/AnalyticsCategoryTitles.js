import OffsetODataDate from '../Common/Date/OffsetODataDate';
import DeviceType from '../Common/DeviceType';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
export default function AnalyticsCategoryTitles(context) {
   const tabletMaxNumOfPoints = 7;
   const phoneMaxNumOfPoints = 4;
   /**
    * PRT Measuring Point Case
    */
   let binding = context.binding;
   if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
      binding = binding.PRTPoint;
   }
   if (ValidationLibrary.evalIsEmpty(binding.MeasurementDocs)) {
      return [];
   }
   ///Sort base on time stamp
   binding.MeasurementDocs.sort(function(a, b) {
      return new Date(a.ReadingTimestamp) - new Date(b.ReadingTimestamp);
   });
   //Fomat the reading dates labels for the chart

   const data = binding.MeasurementDocs
      .map((/** @type {MeasurementDocument} */ doc) => OffsetODataDate(context, doc.ReadingDate, doc.ReadingTime))
      .map(dt => context.formatDate(dt.date(), '', '', { format: 'short' }));

   const deviceType = DeviceType(context);
   ///return the last points depending on the device
   if (deviceType === 'Phone' && binding.MeasurementDocs.length > phoneMaxNumOfPoints) {
      return data.slice(-phoneMaxNumOfPoints);
   } else if (deviceType === 'Tablet' && binding.MeasurementDocs.length > tabletMaxNumOfPoints) {
      return data.slice(-tabletMaxNumOfPoints);
   }
   return data;
}
