import { expect, test, describe } from '@jest/globals';
import { AppSettingsType } from '../src/core/AppSettingsBase';
import AppSettingsHiding from '../src/core/AppSettingsHiding';
import { DefaultSensitiveEnum, DefaultSlotSettingEnum, IAppSetting, ISwapAppService } from '../src/interfaces';

const globalConfig = {
  name: 'app-name',
  resourceGroup: 'resourceGroup name',
  slot: 'production',
  targetSlot: 'staging',
  defaultSlotSetting: DefaultSlotSettingEnum.required, // This will not effect in test
  defaultSensitive: DefaultSensitiveEnum.required, // This will not effect in test
};

describe('App Setting Type', () => {
  test('AppSettingsHiding.hide() (AppSettings) should return null value in appSettings if hideValue is true', () => {
    const swapAppService: ISwapAppService = {
      ...globalConfig,
      connectionStrings: [],
      appSettings: [
        {
          name: 'data',
          sensitive: false,
          slotSetting: true,
          hideValue: true,
        },
      ],
    };

    const appSettings: IAppSetting[] = [
      {
        name: 'data',
        value: 'value',
        slotSetting: true,
      },
    ];

    const expected: IAppSetting[] = [
      {
        name: 'data',
        value: null,
        slotSetting: true,
      },
    ];

    const appSettingsHiding = new AppSettingsHiding(swapAppService, AppSettingsType.AppSettings);
    expect(appSettingsHiding.hide(appSettings, 'staging')).toStrictEqual(expected);
  });

  test('AppSettingsHiding.hide() (AppSettings) should return actual value in appSettings if hideValue is false', () => {
    const swapAppService: ISwapAppService = {
      ...globalConfig,
      defaultSensitive: DefaultSensitiveEnum.required,
      connectionStrings: [],
      appSettings: [
        {
          name: 'data',
          sensitive: false,
          slotSetting: true,
          hideValue: false,
        },
      ],
    };

    const appSettings: IAppSetting[] = [
      {
        name: 'data',
        value: 'value',
        slotSetting: true,
      },
    ];

    const expected: IAppSetting[] = [
      {
        name: 'data',
        value: 'value',
        slotSetting: true,
      },
    ];

    const appSettingsHiding = new AppSettingsHiding(swapAppService, AppSettingsType.AppSettings);
    expect(appSettingsHiding.hide(appSettings, 'staging')).toStrictEqual(expected);
  });

  test('AppSettingsHiding.hide() (AppSettings) should return actual value in appSettings if hideValue is undefined', () => {
    const swapAppService: ISwapAppService = {
      ...globalConfig,
      connectionStrings: [],
      appSettings: [
        {
          name: 'data',
          sensitive: false,
          slotSetting: true,
        },
      ],
    };

    const appSettings: IAppSetting[] = [
      {
        name: 'data',
        value: 'value',
        slotSetting: true,
      },
    ];

    const expected: IAppSetting[] = [
      {
        name: 'data',
        value: 'value',
        slotSetting: true,
      },
    ];

    const appSettingsHiding = new AppSettingsHiding(swapAppService, AppSettingsType.AppSettings);
    expect(appSettingsHiding.hide(appSettings, 'staging')).toStrictEqual(expected);
  });
});

describe('Connection String Type', () => {
  test('AppSettingsHiding.hide() (connectionStrings) should return always null value in connectionStrings if hideValue is true', () => {
    const swapAppService: ISwapAppService = {
      ...globalConfig,
      defaultSensitive: DefaultSensitiveEnum.required,
      connectionStrings: [
        {
          name: 'data',
          sensitive: false,
          slotSetting: true,
          hideValue: true,
        },
      ],
      appSettings: [],
    };

    const appSettings: IAppSetting[] = [
      {
        name: 'data',
        value: 'value',
        slotSetting: true,
      },
    ];

    const expected: IAppSetting[] = [
      {
        name: 'data',
        value: null,
        slotSetting: true,
      },
    ];

    const appSettingsHiding = new AppSettingsHiding(swapAppService, AppSettingsType.ConnectionStrings);
    expect(appSettingsHiding.hide(appSettings, 'staging')).toStrictEqual(expected);
  });

  test('AppSettingsHiding.hide() (connectionStrings) should return always null value in connectionStrings if hideValue is false', () => {
    const swapAppService: ISwapAppService = {
      ...globalConfig,
      connectionStrings: [
        {
          name: 'data',
          sensitive: false,
          slotSetting: true,
          hideValue: false,
        },
      ],
      appSettings: [],
    };

    const appSettings: IAppSetting[] = [
      {
        name: 'data',
        value: 'value',
        slotSetting: true,
      },
    ];

    const expected: IAppSetting[] = [
      {
        name: 'data',
        value: 'value',
        slotSetting: true,
      },
    ];

    const appSettingsHiding = new AppSettingsHiding(swapAppService, AppSettingsType.ConnectionStrings);
    expect(appSettingsHiding.hide(appSettings, 'staging')).toStrictEqual(expected);
  });

  test('AppSettingsHiding.hide() (connectionStrings) should return always null value in connectionStrings if defaultHideValue is true, and no specific config for hideValue', () => {
    const swapAppService: ISwapAppService = {
      ...globalConfig,
      defaultHideValue: true,
      connectionStrings: [],
      appSettings: [],
    };

    const appSettings: IAppSetting[] = [
      {
        name: 'data',
        value: 'value',
        slotSetting: true,
      },
    ];

    const expected: IAppSetting[] = [
      {
        name: 'data',
        value: null,
        slotSetting: true,
      },
    ];

    const appSettingsHiding = new AppSettingsHiding(swapAppService, AppSettingsType.ConnectionStrings);
    expect(appSettingsHiding.hide(appSettings, 'staging')).toStrictEqual(expected);
  });
});
