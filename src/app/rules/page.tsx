import { RulesManager } from "./components/rules-manager";
import type { RuleFile } from "@/lib/types";

export const dynamic = 'force-dynamic';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getYaraRules(): Promise<RuleFile[]> {
  const res = await fetch(`${API_URL}/api/rules/yara`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch YARA rule data');
  return res.json();
}

async function getSysmonRules(): Promise<RuleFile[]> {
    const res = await fetch(`${API_URL}/api/rules/sysmon`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch Sysmon rule data');
    return res.json();
}

export default async function RulesPage() {
  const yaraRules = await getYaraRules();
  const sysmonRules = await getSysmonRules();
  return (
    <RulesManager initialYaraRules={yaraRules} initialSysmonRules={sysmonRules} />
  );
}
