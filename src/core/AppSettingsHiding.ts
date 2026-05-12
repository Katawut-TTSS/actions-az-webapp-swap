import * as core from '@actions/core';
import { ISwapAppService, IAppSetting } from '../interfaces';
import { findAppSettingName } from '../utils/swapAppSettingsUtility';
import { AppSettingsType } from './AppSettingsBase';

export default class AppSettingsHiding {
  constructor(private swapAppService: ISwapAppService, private type: AppSettingsType) {}

  public hide(appSettings: IAppSetting[], slot?: string) {
    const swapAppSettings =
      this.type === AppSettingsType.ConnectionStrings
        ? this.swapAppService.connectionStrings
        : this.swapAppService.appSettings;

    if (this.type === AppSettingsType.ConnectionStrings && this.swapAppService.defaultHideValue === true) {
      for (const appSetting of appSettings) {
        appSetting.value = null;
      }
      return appSettings;
    }

    for (const swapAppSetting of swapAppSettings) {
      if (swapAppSetting.hideValue === true) {
        const found = findAppSettingName(swapAppSetting.name, appSettings);
        if (found >= 0) {
          const foundAppSetting = appSettings[found];
          foundAppSetting.value = null;
        } else {
          core.warning(
            `Cannot hiding the app setting name "${swapAppSetting.name}" on app service "${this.swapAppService.name}/${slot}" because app setting name is not found`
          );
        }
      }
    }
    return appSettings;
  }
}
