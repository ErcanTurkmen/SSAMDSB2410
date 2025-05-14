
import inboundOrOutboundUpdatePost from '../InboundOrOutbound/InboundOrOutboundUpdatePost';

// This function is used to call the InboundOrOutboundUpdatePost save logic 
export default function InboundOutboundCreateUpdatePostWrapper(context) {
return inboundOrOutboundUpdatePost(context);
}
