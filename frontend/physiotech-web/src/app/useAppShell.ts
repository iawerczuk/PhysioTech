import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import type { Device } from "../types";
import type { Cart } from "../features/rentals/rentalTypes";

type ActivePanel = "none" | "konto" | "rental";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function useAppShell() {
  const { user } = useAuth();

  const [activePanel, setActivePanel] = useState<ActivePanel>("none");
  const [cart, setCart] = useState<Cart[]>([]);

  const isAuthed = !!user;

  const openAccount = useCallback(() => setActivePanel("konto"), []);
  const openRental = useCallback(() => setActivePanel("rental"), []);
  const closePanels = useCallback(() => setActivePanel("none"), []);

  const requireAuth = useCallback(() => {
    setActivePanel("konto");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const addToCart = useCallback(
    (device: Device) => {
      if (!isAuthed) {
        requireAuth();
        return;
      }

      setCart((prev) => {
        const idx = prev.findIndex((x) => x.deviceId === device.id);

        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
          return copy;
        }

        const t = todayISO();

        return [
          ...prev,
          {
            deviceId: device.id,
            name: device.name,
            pricePerDay: device.pricePerDay,
            deposit: device.deposit,
            quantity: 1,
            startDate: t,
            endDate: t,
          },
        ];
      });

      setActivePanel("rental");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [isAuthed, requireAuth]
  );

  const setQty = useCallback((deviceId: number, quantity: number) => {
    setCart((prev) =>
      prev
        .map((x) => (x.deviceId === deviceId ? { ...x, quantity } : x))
        .filter((x) => x.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((deviceId: number) => {
    setCart((prev) => prev.filter((x) => x.deviceId !== deviceId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const setItemDates = useCallback(
    (deviceId: number, startDate: string, endDate: string) => {
      setCart((prev) =>
        prev.map((x) =>
          x.deviceId === deviceId ? { ...x, startDate, endDate } : x
        )
      );
    },
    []
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, x) => sum + x.quantity, 0),
    [cart]
  );

  return {
    user,
    isAuthed,

    activePanel,
    setActivePanel,
    openAccount,
    openRental,
    closePanels,
    requireAuth,

    cart,
    cartCount,
    addToCart,
    setQty,
    removeItem,
    clearCart,
    setItemDates,
  };
}

export type AppShell = ReturnType<typeof useAppShell>;