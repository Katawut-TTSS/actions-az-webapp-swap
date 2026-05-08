import * as core from '@actions/core';
import { ISwapAppService } from '../interfaces';

export const FUNCTION_APP_CRITICAL_SETTINGS = [
  'AzureWebJobsStorage',
  'FUNCTIONS_WORKER_RUNTIME',
  'FUNCTIONS_EXTENSION_VERSION',
];

export const FUNCTION_APP_NON_SLOT_SETTINGS = ['WEBSITE_CONTENTAZUREFILECONNECTIONSTRING', 'WEBSITE_CONTENTSHARE'];

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

  for (const criticalSetting of FUNCTION_APP_CRITICAL_SETTINGS) {
    const found = appSettingsByName.get(criticalSetting);
    if (found && !found.slotSetting) {
      core.warning(
        `Function App critical setting '${criticalSetting}' is not marked as slotSetting. Swapping this setting may cause issues.`
      );
    }
  }

  for (const nonSlotSetting of FUNCTION_APP_NON_SLOT_SETTINGS) {
    const found = appSettingsByName.get(nonSlotSetting);
    if (found && found.slotSetting) {
      core.warning(`Function App setting '${nonSlotSetting}' should not be marked as slotSetting.`);
    }
  }
}
