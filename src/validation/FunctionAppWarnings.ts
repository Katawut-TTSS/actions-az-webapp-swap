import * as core from '@actions/core';
import { ISwapAppService } from '../interfaces';

export const FUNCTION_APP_CRITICAL_SETTINGS = [
  'AzureWebJobsStorage',
  'FUNCTIONS_WORKER_RUNTIME',
  'FUNCTIONS_EXTENSION_VERSION',
];

// Azure rejects these Function App content-share settings when they are marked as slot settings.
export const FUNCTION_APP_NON_SLOT_SETTINGS = ['WEBSITE_CONTENTAZUREFILECONNECTIONSTRING', 'WEBSITE_CONTENTSHARE'];

export function normalizeFunctionAppSlotSetting(
  resourceType: ISwapAppService['resourceType'],
  settingName: string,
  slotSetting: boolean
): boolean {
  if (resourceType === 'function_app' && FUNCTION_APP_NON_SLOT_SETTINGS.includes(settingName)) {
    return false;
  }
  return slotSetting;
}

/**
 * Emits core.warning() for each critical Function App setting that is not marked as slotSetting: true.
 * Only runs when resourceType === 'function_app'. Non-blocking.
 */
export function warnFunctionAppCriticalSettings(
  swapAppService: Pick<ISwapAppService, 'resourceType' | 'appSettings'>
): void {
  if (swapAppService.resourceType !== 'function_app') {
    return;
  }

  const appSettingsByName = new Map<string, { slotSetting: boolean }>();
  for (const setting of swapAppService.appSettings) {
    appSettingsByName.set(setting.name, { slotSetting: setting.slotSetting === true });
  }

  for (const nonSlotSetting of FUNCTION_APP_NON_SLOT_SETTINGS) {
    const found = appSettingsByName.get(nonSlotSetting);
    if (found?.slotSetting) {
      core.warning(
        `Function App setting '${nonSlotSetting}' cannot be marked as slotSetting. The action will treat it as slotSetting: false.`
      );
    }
  }

  for (const criticalSetting of FUNCTION_APP_CRITICAL_SETTINGS) {
    const found = appSettingsByName.get(criticalSetting);
    if (found && !found.slotSetting) {
      core.warning(
        `Function App critical setting '${criticalSetting}' is not marked as slotSetting. Swapping this setting may cause issues.`
      );
    }
  }
}
