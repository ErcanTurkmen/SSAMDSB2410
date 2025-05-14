export default class {
    
   static setTitle(context, title) {
      context?._control?._headerDescriptionContainer?.setHeader(title);
   }

   static setDescription(context, description) {
      context?._control?._headerDescriptionContainer?.setDescription(description);
   }
}
