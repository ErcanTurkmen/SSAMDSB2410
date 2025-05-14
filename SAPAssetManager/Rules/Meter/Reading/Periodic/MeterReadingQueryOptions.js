export default function MeterReadingQueryOptions(context) {
     let defaultQueryOpts = ['$orderby=SchedMeterReadingDate,Register', '$expand=MeterReadingLimit_Nav'];
     if (context.binding.FromSingleRegister) {
         defaultQueryOpts.push(`$filter=Register eq '${context.binding.FromSingleRegister}' and SchedMeterReadingDate eq datetime'${context.binding.readDate}'`);
     }

     return defaultQueryOpts.join('&');
 }
