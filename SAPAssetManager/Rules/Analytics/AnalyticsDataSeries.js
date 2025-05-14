import chartType from './ChartType';
import libCommon from '../Common/Library/CommonLibrary';
import deviceType from '../Common/DeviceType';

export default function AnalyticsDataSeries(context) {
   let data = [];
   /**
   * PRT Measuring Point Case
   */

   let binding = getBinding(context);

   /**
    * Returns data depending on the type of chart
    */
   if (binding.MeasurementDocs.length > 0) {
      ///Sorting by  date
      binding.MeasurementDocs.sort(function(a, b) {
         return new Date(a.ReadingTimestamp) - new Date(b.ReadingTimestamp);
      });
      data = generateData(binding, context);
      data = limitDataPoints(data, binding, context);

   }

   return [data];
}

function getBinding(context) {
   let binding = context.binding;
   if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
      binding = binding.PRTPoint;
   }
   return binding;
}

function generateData(binding, context) {
   let data = [];
   switch (chartType(context)) {
      case 'valCode':
         ///Valuation code plots no data points
         break;
      case 'Line':
         ///Line chart plots reading values
         for (const measurementDoc of binding.MeasurementDocs) {
            data.push(measurementDoc.ReadingValue);
         }
         break;
      case 'Column':
         ///Column chart plots the difference
         for (const measurementDoc of binding.MeasurementDocs) {
            if (!libCommon.isCurrentReadLinkLocal(measurementDoc['@odata.readLink'])) {
               data.push(measurementDoc.CounterReadingDifference);
            }
         }
         break;
      default:
         break;
   }

   return data;
}

function limitDataPoints(data, binding, context) {
   const tabletMaxNumOfPoints = 7;
   const phoneMaxNumOfPoints = 4;

   switch (deviceType(context)) {
      ///return the last points depending on the device
      case 'Phone':
         if (binding.MeasurementDocs.length > phoneMaxNumOfPoints) {
            data = data.slice(-phoneMaxNumOfPoints);
         }
         break;
      case 'Tablet':
         if (binding.MeasurementDocs.length > tabletMaxNumOfPoints) {
            data = data.slice(-tabletMaxNumOfPoints);
         }
         break;
      default:
         break;
   }
   
   return data;
}
