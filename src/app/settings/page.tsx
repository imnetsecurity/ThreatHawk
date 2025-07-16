import { SettingsManager } from "./components/settings-manager";
import { AppSettings } from "@/lib/types";

export const dynamic = 'force-dynamic';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getSettings(): Promise<AppSettings> {
    const res = await fetch(`${API_URL}/api/settings`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch settings data');
    return res.json();
}

export default async function SettingsPage() {
    const initialSettings = await getSettings();
    return (
        <SettingsManager initialSettings={initialSettings} />
    );
}
