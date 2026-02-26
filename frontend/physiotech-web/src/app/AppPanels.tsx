import AccountPanel from "../features/account/AccountPanel";
import RentalPanel from "../features/rentals/RentalPanel";
import type { AppShell } from "./useAppShell";

type Props = { shell: AppShell };

export default function AppPanels({ shell }: Props) {
  const showAccount = shell.activePanel === "konto";
  const showRental = shell.activePanel === "rental";

  if (!showAccount && !showRental) return null;

  return (
    <div className="sticky top-20 z-30">
      <div className="mx-auto max-w-6xl px-6 space-y-4">
        <AccountPanel open={showAccount} onClose={shell.closePanels} cart={shell.cart} setItemDates={shell.setItemDates} />

        <RentalPanel
          open={showRental}
          onClose={shell.closePanels}
          cart={shell.cart}
          setQty={shell.setQty}
          removeItem={shell.removeItem}
          clearCart={shell.clearCart}
          setItemDates={shell.setItemDates}
          onRequireAuth={shell.requireAuth}
        />
      </div>
    </div>
  );
}