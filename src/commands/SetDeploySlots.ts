import * as core from '@actions/core';
import { ISwapAppService } from '../interfaces';
import AppSettings from '../core/AppSettings';
import { AppSettingsType } from '../core/AppSettingsBase';
import { AppSettingsProviderFactory } from '../core/AppSettingsProviderFactory';

export class SetDeploySlots {
  constructor(private swapAppService: ISwapAppService) {}

  public async execute() {
    core.debug(`Using set-deploy-slots mode`);
    core.info('Getting App Setting from Azure ');
    if (this.swapAppService.resourceType === 'function_app') {
      await this.executeForFunctionApp();
      return;
    }

    await this.executeForWebApp();
  }

  private async executeForWebApp() {
    await Promise.all([
      this.setAppSettings(AppSettingsType.AppSettings),
      this.setAppSettings(AppSettingsType.ConnectionStrings),
    ]);
  }

  private async executeForFunctionApp() {
    await this.setFunctionAppSettings(AppSettingsType.AppSettings);
    await this.setFunctionAppSettings(AppSettingsType.ConnectionStrings);
  }

  private async setAppSettings(type: AppSettingsType) {
    const appSetting = AppSettingsProviderFactory.getAppSettingsProvider(type, this.swapAppService);
    (await appSetting.list()).fullfill().apply();
    core.info('Setting App Setting to Azure');
    await Promise.all([appSetting.setWebAppSourceSlot(), appSetting.setWebAppTargetSlot()]);
  }

  private async setFunctionAppSettings(type: AppSettingsType) {
    const appSetting = AppSettingsProviderFactory.getAppSettingsProvider(type, this.swapAppService);
    const { slot, targetSlot } = this.swapAppService;

    (await appSetting.list()).fullfill().apply();
    core.info('Setting App Setting to Azure sequentially for Function App');
    await appSetting.setWebApp(appSetting.getSource(), slot);
    await appSetting.setWebApp(appSetting.getTarget(), targetSlot);
  }
}
