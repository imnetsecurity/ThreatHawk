
"use server";

import { generateSysmonRuleFromText } from "@/ai/flows/ai-rule-from-text";

export async function generateRuleFromText(prompt: string) {
  const result = await generateSysmonRuleFromText({
    request: prompt,
  });
  return result;
}

/**
 * Appends a new Sysmon rule to an existing Sysmon configuration XML.
 * It intelligently finds the last RuleGroup and appends the new rule inside it.
 * @param {string} currentConfig The full existing Sysmon XML configuration.
 * @param {string} newRule The new rule XML to append (a <Rule>...</Rule> block).
 * @returns {Promise<string>} The updated Sysmon configuration.
 */
export async function appendRuleToConfig(currentConfig: string, newRule: string): Promise<string> {
  // Find the last </RuleGroup> tag to insert the new rule before it.
  const lastRuleGroupEnd = currentConfig.lastIndexOf("</RuleGroup>");
  
  if (lastRuleGroupEnd === -1) {
    // If no RuleGroup is found, we can't append. Throw an error.
    throw new Error("Could not find a <RuleGroup> in the current configuration to append the rule to.");
  }
  
  // Insert the new rule with proper indentation before the closing tag.
  const indentedNewRule = newRule.split('\n').map(line => `      ${line}`).join('\n');
  const updatedConfig = [
    currentConfig.slice(0, lastRuleGroupEnd),
    indentedNewRule,
    '\n    ', // Add indentation for the closing tag
    currentConfig.slice(lastRuleGroupEnd)
  ].join('');

  return updatedConfig;
}
