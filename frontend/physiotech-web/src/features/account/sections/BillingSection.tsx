import type { BillingErrors, BillingForm } from '../accountTypes';
import ActionButton from "../components/ActionButton";
import Tooltip from "../components/Tooltip";

type Props = {
  userEmail: string;
  firstName?: string | null;
  lastName?: string | null;
  editMode: boolean;
  setEditMode: (v: boolean) => void;

  billing: BillingForm;
  setField: <K extends keyof BillingForm>(key: K, value: BillingForm[K]) => void;

  billingErrors: BillingErrors;

  saveOk: string | null;
  saveErr: string | null;
  onSave: () => void;

  inputCls: (disabled: boolean, hasError?: boolean) => string;
};

export default function BillingSection({
  userEmail,
  firstName,
  lastName,
  editMode,
  setEditMode,
  billing,
  setField,
  billingErrors,
  saveOk,
  saveErr,
  onSave,
  inputCls,
}: Props) {
  return (
    <div className="mt-8 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
      <h3 className="text-base font-semibold text-slate-900">Dane</h3>

      <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="group relative">
                <div className="text-xs font-medium text-slate-500">Imię</div>
                <input className={inputCls(true)} value={ firstName ?? ""} disabled  />
                <Tooltip text="To pole pochodzi z backendu i nie można go edytować." />
              </div>

              <div className="group relative">
                <div className="text-xs font-medium text-slate-500">Nazwisko</div>
                <input className={inputCls(true)} value={ lastName ?? ""} disabled />
                <Tooltip text="To pole pochodzi z backendu i nie można go edytować." />
              </div>
            </div>

            <div className="group relative">
              <div className="text-xs font-medium text-slate-500">Email</div>
              <input className={inputCls(true)} value={userEmail} disabled />
              <Tooltip text="Email jest tylko do odczytu." />
            </div>

            <div>
              <div className="text-xs font-medium text-slate-500">Adres</div>
              <input
                className={inputCls(!editMode, !!billingErrors.address)}
                value={billing.address}
                onChange={(e) => setField("address", e.target.value)}
                disabled={!editMode}
              />
              {billingErrors.address && <div className="mt-1 text-xs text-red-700">{billingErrors.address}</div>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-medium text-slate-500">Miasto</div>
                <input
                  className={inputCls(!editMode, !!billingErrors.city)}
                  value={billing.city}
                  onChange={(e) => setField("city", e.target.value)}
                  disabled={!editMode}
                />
                {billingErrors.city && <div className="mt-1 text-xs text-red-700">{billingErrors.city}</div>}
              </div>

              <div>
                <div className="text-xs font-medium text-slate-500">Kod pocztowy</div>
                <input
                  className={inputCls(!editMode, !!billingErrors.postalCode)}
                  value={billing.postalCode}
                  onChange={(e) => setField("postalCode", e.target.value)}
                  disabled={!editMode}
                  placeholder="00-000"
                />
                {billingErrors.postalCode && <div className="mt-1 text-xs text-red-700">{billingErrors.postalCode}</div>}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="mt-1 accent-emerald-600"
                checked={billing.needInvoice}
                onChange={(e) => setField("needInvoice", e.target.checked)}
                disabled={!editMode}
              />
              <span>Potrzebuję faktury</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-medium text-slate-500">Nazwa firmy</div>
                <input
                  className={inputCls(!editMode || !billing.needInvoice, !!billingErrors.companyName)}
                  value={billing.companyName}
                  onChange={(e) => setField("companyName", e.target.value)}
                  disabled={!editMode || !billing.needInvoice}
                  placeholder={billing.needInvoice ? "Wymagane" : "Opcjonalnie"}
                />
                {billingErrors.companyName && <div className="mt-1 text-xs text-red-700">{billingErrors.companyName}</div>}
              </div>

              <div>
                <div className="text-xs font-medium text-slate-500">NIP</div>
                <input
                  className={inputCls(!editMode || !billing.needInvoice, !!billingErrors.nip)}
                  value={billing.nip}
                  onChange={(e) => setField("nip", e.target.value)}
                  disabled={!editMode || !billing.needInvoice}
                  placeholder={billing.needInvoice ? "Wymagane" : "Opcjonalnie"}
                  inputMode="numeric"
                />
                {billingErrors.nip && <div className="mt-1 text-xs text-red-700">{billingErrors.nip}</div>}
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-end gap-2 pt-3">
              <ActionButton
                active={editMode}
                onClick={() => setEditMode(true)}
              >
                Edytuj
              </ActionButton>

              <ActionButton
                active={editMode}
                disabled={!editMode}
                onClick={onSave}
              >
                Zapisz
              </ActionButton>

              {saveOk && <span className="text-sm text-emerald-700">{saveOk}</span>}
              {saveErr && <span className="text-sm text-red-700">{saveErr}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}