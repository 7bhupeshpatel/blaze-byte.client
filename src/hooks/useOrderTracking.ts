import { useEffect, useState } from "react";
import { guestApiService } from "../services/guest.service";

export const useGuestOrderTracking = (orderId: string | null) => {
  const [status, setStatus] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const data = await guestApiService.getOrderStatus(orderId);
        setStatus(data.status);

        if (data.status === "COMPLETED") {
          setCompleted(true);
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  return { status, completed };
};