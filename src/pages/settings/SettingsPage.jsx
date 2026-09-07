import React from 'react';
import { Settings, User, Shield, Bell } from 'lucide-react';

const settingsSections = [
  { icon: User, title: 'Profile', description: 'Manage your public profile information.' },
  { icon: Bell, title: 'Notifications', description: 'Choose which activity updates you receive.' },
  { icon: Shield, title: 'Privacy and security', description: 'Review your account privacy and security options.' },
];

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
            <p className="text-sm text-text-secondary">Manage your Postly account preferences.</p>
          </div>
        </div>

        <div className="space-y-3">
          {settingsSections.map(({ icon, title, description }) => (
            <button
              key={title}
              type="button"
              className="flex w-full items-center gap-4 rounded-2xl border border-border bg-surface-elevated p-4 text-left transition-colors hover:border-violet-500/50 hover:bg-surface-muted"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-text-secondary">
                {React.createElement(icon, { size: 18 })}
              </div>
              <div>
                <h2 className="text-sm font-medium text-text-primary">{title}</h2>
                <p className="mt-1 text-sm text-text-secondary">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;