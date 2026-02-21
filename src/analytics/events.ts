import { sendGAEvent as nextSendGAEvent } from "@next/third-parties/google";

export const TAP_CARD = "TAP_CARD";
export const STICKY_BANNER = "STICKY_BANNER";

export const sendGAEvent = (event: string, properties?: Record<string, any>) => {
  if (properties) {
    nextSendGAEvent("event", event, properties);
  } else {
    nextSendGAEvent("event", event);
  }
};
