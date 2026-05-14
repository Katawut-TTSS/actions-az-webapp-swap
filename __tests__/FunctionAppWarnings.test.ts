import { expect, test, describe, jest, beforeEach } from '@jest/globals';
import * as core from '@actions/core';
import {
  warnFunctionAppCriticalSettings,
  FUNCTION_APP_CRITICAL_SETTINGS,
  FUNCTION_APP_NON_SLOT_SETTINGS,
} from '../src/validation/FunctionAppWarnings';
import { DefaultSensitiveEnum, DefaultSlotSettingEnum } from '../src/interfaces';

jest.mock('@actions/core');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockFn = { mock: { calls: any[] }; mockClear: () => void };

const mockWarning = core.warning as unknown as MockFn;

const baseSwapAppService = {
  defaultSensitive: DefaultSensitiveEnum.false,
  defaultSlotSetting: DefaultSlotSettingEnum.false,
  connectionStrings: [],
};

describe('warnFunctionAppCriticalSettings', () => {
  beforeEach(() => {
    mockWarning.mockClear();
  });

  describe('when resourceType is function_app', () => {
    test('emits warning for each critical setting not marked as slotSetting', () => {
      const appSettings = FUNCTION_APP_CRITICAL_SETTINGS.map(name => ({
        name,
        sensitive: false,
        slotSetting: false,
      }));

      warnFunctionAppCriticalSettings({
        ...baseSwapAppService,
        resourceType: 'function_app',
        appSettings,
      });

      expect(mockWarning.mock.calls).toHaveLength(FUNCTION_APP_CRITICAL_SETTINGS.length);
      for (const name of FUNCTION_APP_CRITICAL_SETTINGS) {
        expect(mockWarning.mock.calls).toContainEqual([
          `Function App critical setting '${name}' is not marked as slotSetting. Swapping this setting may cause issues.`,
        ]);
      }
    });

    test('does not emit warning for critical settings marked as slotSetting: true', () => {
      const appSettings = FUNCTION_APP_CRITICAL_SETTINGS.map(name => ({
        name,
        sensitive: false,
        slotSetting: true,
      }));

      warnFunctionAppCriticalSettings({
        ...baseSwapAppService,
        resourceType: 'function_app',
        appSettings,
      });

      expect(mockWarning.mock.calls).toHaveLength(0);
    });

    test('emits warning only for critical settings not marked as slotSetting', () => {
      const appSettings = [
        { name: 'AzureWebJobsStorage', sensitive: false, slotSetting: true },
        { name: 'FUNCTIONS_WORKER_RUNTIME', sensitive: false, slotSetting: false },
        { name: 'FUNCTIONS_EXTENSION_VERSION', sensitive: false, slotSetting: true },
      ];

      warnFunctionAppCriticalSettings({
        ...baseSwapAppService,
        resourceType: 'function_app',
        appSettings,
      });

      expect(mockWarning.mock.calls).toHaveLength(1);
      expect(mockWarning.mock.calls).toContainEqual([
        `Function App critical setting 'FUNCTIONS_WORKER_RUNTIME' is not marked as slotSetting. Swapping this setting may cause issues.`,
      ]);
    });

    test('emits warning when a non-slot Function App setting is marked as slotSetting', () => {
      const appSettings = FUNCTION_APP_NON_SLOT_SETTINGS.map(name => ({
        name,
        sensitive: false,
        slotSetting: true,
      }));

      warnFunctionAppCriticalSettings({
        ...baseSwapAppService,
        resourceType: 'function_app',
        appSettings,
      });

      expect(mockWarning.mock.calls).toHaveLength(FUNCTION_APP_NON_SLOT_SETTINGS.length);
      for (const name of FUNCTION_APP_NON_SLOT_SETTINGS) {
        expect(mockWarning.mock.calls).toContainEqual([
          `Function App setting '${name}' cannot be marked as slotSetting. The action will treat it as slotSetting: false.`,
        ]);
      }
    });

    test('does not emit warnings for non-critical settings', () => {
      const appSettings = [
        { name: 'MY_CUSTOM_SETTING', sensitive: false, slotSetting: false },
        { name: 'ANOTHER_SETTING', sensitive: false, slotSetting: false },
      ];

      warnFunctionAppCriticalSettings({
        ...baseSwapAppService,
        resourceType: 'function_app',
        appSettings,
      });

      expect(mockWarning.mock.calls).toHaveLength(0);
    });

    test('does not emit warnings when appSettings is empty', () => {
      warnFunctionAppCriticalSettings({
        ...baseSwapAppService,
        resourceType: 'function_app',
        appSettings: [],
      });

      expect(mockWarning.mock.calls).toHaveLength(0);
    });
  });

  describe('when resourceType is web_app', () => {
    test('does not emit any warnings', () => {
      const appSettings = FUNCTION_APP_CRITICAL_SETTINGS.map(name => ({
        name,
        sensitive: false,
        slotSetting: false,
      }));

      warnFunctionAppCriticalSettings({
        ...baseSwapAppService,
        resourceType: 'web_app',
        appSettings,
      });

      expect(mockWarning.mock.calls).toHaveLength(0);
    });
  });

  describe('when resourceType is undefined', () => {
    test('does not emit any warnings', () => {
      const appSettings = FUNCTION_APP_CRITICAL_SETTINGS.map(name => ({
        name,
        sensitive: false,
        slotSetting: false,
      }));

      warnFunctionAppCriticalSettings({
        ...baseSwapAppService,
        resourceType: undefined,
        appSettings,
      });

      expect(mockWarning.mock.calls).toHaveLength(0);
    });
  });
});
