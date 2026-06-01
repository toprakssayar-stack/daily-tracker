"use client";

import { useEffect, useRef, useState } from "react";
import { store } from "@/lib/store";
import Header from "@/components/Header";
import {
  Bell,
  BellOff,
  Smartphone,
  Download,
  Upload,
  Info,
  Trash2,
  HardDriveDownload,
} from "lucide-react";

const STORAGE_KEY = "notifications-enabled";
const LEAD_MINUTES_KEY = "notifications-lead-minutes";

export default function SettingsPage() {
  const [notifOn, setNotifOn] = useState(false);
  const [leadMin, setLeadMin] = useState(10);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [installPromptVisible, setInstallPromptVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
    setNotifOn(localStorage.getItem(STORAGE_KEY) === "true");
    const lead = localStorage.getItem(LEAD_MINUTES_KEY);
    if (lead) setLeadMin(parseInt(lead, 10));

    const handler = (e: Event) => {
      e.preventDefault();
      (window as unknown as { _deferredPrompt: Event })._deferredPrompt = e;
      setInstallPromptVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function toggleNotifications() {
    if (!("Notification" in window)) {
      alert("Your browser doesn't support notifications.");
      return;
    }
    if (notifOn) {
      localStorage.setItem(STORAGE_KEY, "false");
      setNotifOn(false);
      return;
    }
    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm === "granted") {
      localStorage.setItem(STORAGE_KEY, "true");
      setNotifOn(true);
      new Notification("Daily Tracker", {
        body: "Notifications are on. We'll remind you before events.",
        icon: "/icon-192.png",
      });
    }
  }

  function updateLead(v: number) {
    setLeadMin(v);
    localStorage.setItem(LEAD_MINUTES_KEY, String(v));
  }

  async function install() {
    const deferred = (
      window as unknown as { _deferredPrompt?: { prompt: () => Promise<void> } }
    )._deferredPrompt;
    if (!deferred) return;
    await deferred.prompt();
    setInstallPromptVisible(false);
  }

  function exportData() {
    const data = store.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const stamp = new Date().toISOString().slice(0, 10);
    a.download = `daily-tracker-backup-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (
          !confirm(
            "This will replace all current data with the backup. Continue?"
          )
        )
          return;
        store.importAll(data);
        alert("Backup restored.");
      } catch {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  }

  function clearAll() {
    if (
      !confirm(
        "Delete ALL your routines, events, tasks, and notes? This can't be undone."
      )
    )
      return;
    if (!confirm("Really? Last chance.")) return;
    store.clearAll();
    alert("All data cleared.");
  }

  return (
    <>
      <Header title="Settings" subtitle="Preferences & data" />

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <section className="space-y-2">
          <h2 className="text-xs uppercase tracking-wider text-fg-muted px-1">
            Notifications
          </h2>
          <div className="card flex items-center gap-3">
            {notifOn ? (
              <Bell size={20} className="text-accent" />
            ) : (
              <BellOff size={20} className="text-fg-muted" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium">Event reminders</p>
              <p className="text-xs text-fg-muted">
                {permission === "denied"
                  ? "Blocked — enable in browser settings"
                  : notifOn
                  ? `On — alerts ${leadMin} min before`
                  : "Off"}
              </p>
            </div>
            <button
              onClick={toggleNotifications}
              disabled={permission === "denied"}
              className="btn btn-secondary text-sm"
            >
              {notifOn ? "Disable" : "Enable"}
            </button>
          </div>
          {notifOn && (
            <div className="card">
              <label className="text-sm font-medium block mb-2">
                Remind me before:
              </label>
              <div className="flex gap-1">
                {[5, 10, 15, 30, 60].map((m) => (
                  <button
                    key={m}
                    onClick={() => updateLead(m)}
                    className="btn flex-1 text-sm"
                    style={{
                      background:
                        leadMin === m ? "var(--accent)" : "var(--bg-elev-2)",
                      color: leadMin === m ? "var(--accent-fg)" : "var(--fg)",
                    }}
                  >
                    {m}m
                  </button>
                ))}
              </div>
              <p className="text-xs text-fg-muted mt-2">
                Notifications fire when the app is open or installed as a PWA.
              </p>
            </div>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="text-xs uppercase tracking-wider text-fg-muted px-1">
            Backup & Data
          </h2>
          <div className="card flex items-start gap-3 text-sm text-fg-muted">
            <HardDriveDownload
              size={18}
              className="text-fg-muted shrink-0 mt-0.5"
            />
            <p>
              Your data lives only on this device. Export regularly to keep a
              backup.
            </p>
          </div>
          <button
            onClick={exportData}
            className="card w-full flex items-center gap-3 text-left hover:bg-bg-elev-2 transition-colors"
          >
            <Download size={20} className="text-accent" />
            <div className="flex-1">
              <p className="font-medium">Export backup</p>
              <p className="text-xs text-fg-muted">
                Downloads a JSON file with everything
              </p>
            </div>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="card w-full flex items-center gap-3 text-left hover:bg-bg-elev-2 transition-colors"
          >
            <Upload size={20} className="text-accent" />
            <div className="flex-1">
              <p className="font-medium">Import backup</p>
              <p className="text-xs text-fg-muted">
                Restore from a previously exported file
              </p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importData(f);
              e.target.value = "";
            }}
          />
          <button
            onClick={clearAll}
            className="card w-full flex items-center gap-3 text-left hover:bg-bg-elev-2 transition-colors"
          >
            <Trash2 size={20} className="text-danger" />
            <div className="flex-1">
              <p className="font-medium text-danger">Clear all data</p>
              <p className="text-xs text-fg-muted">
                Deletes every routine, event, task and note
              </p>
            </div>
          </button>
        </section>

        {installPromptVisible && (
          <section className="space-y-2">
            <h2 className="text-xs uppercase tracking-wider text-fg-muted px-1">
              App
            </h2>
            <button
              onClick={install}
              className="card w-full flex items-center gap-3 text-left hover:bg-bg-elev-2"
            >
              <Smartphone size={20} className="text-accent" />
              <div className="flex-1 min-w-0">
                <p className="font-medium">Install on this device</p>
                <p className="text-xs text-fg-muted">
                  Add Daily Tracker to your home screen
                </p>
              </div>
            </button>
          </section>
        )}

        <section className="space-y-2">
          <h2 className="text-xs uppercase tracking-wider text-fg-muted px-1">
            About
          </h2>
          <div className="card flex items-start gap-3">
            <Smartphone size={20} className="text-fg-muted shrink-0 mt-0.5" />
            <div className="text-sm text-fg-muted space-y-1">
              <p>
                Add to your Android home screen: Chrome menu → <b>Install app</b>{" "}
                or <b>Add to Home screen</b>.
              </p>
              <p>
                On iPhone: Safari share sheet → <b>Add to Home Screen</b>.
              </p>
            </div>
          </div>
          <div className="card flex items-start gap-3">
            <Info size={20} className="text-fg-muted shrink-0 mt-0.5" />
            <p className="text-sm text-fg-muted">Daily Tracker · v1.0</p>
          </div>
        </section>
      </main>
    </>
  );
}
