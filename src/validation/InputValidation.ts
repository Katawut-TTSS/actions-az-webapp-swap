import { ISwapAppService, DefaultSensitiveEnum, DefaultSlotSettingEnum } from '../interfaces';
import { z } from 'zod';

const AppSettingSchema = z.object({
  name: z.string(),
  // TODO: Make it optional later
  sensitive: z.boolean(),
  // TODO: Make it optional later
  slotSetting: z.boolean(),
  hideValue: z.boolean().optional(),
});

const SwapAppServiceSchema = z.object({
  name: z.string(),
  resourceGroup: z.string(),
  subscriptionId: z.string().optional(),
  slot: z.string(),
  targetSlot: z.string(),
  defaultSlotSetting: z.nativeEnum(DefaultSlotSettingEnum),
  defaultSensitive: z.nativeEnum(DefaultSensitiveEnum),
  defaultHideValue: z.boolean().optional(),
  resourceType: z.enum(['web_app', 'function_app']).optional(),
  appSettings: z.array(AppSettingSchema).optional(),
  connectionStrings: z.array(AppSettingSchema).optional(),
});

export default class InputValidation {
  public static validateArray(swapAppServiceList: Partial<ISwapAppService>[]): ISwapAppService[] {
    return swapAppServiceList.map((swapAppService) => InputValidation.validate(swapAppService));
  }

  public static validate(swapAppService: Partial<ISwapAppService>): ISwapAppService {
    const result = SwapAppServiceSchema.safeParse(swapAppService);
    if (!result.success) {
      const formatted = result.error.format();
      // TODO: Make Human readable error message
      console.error(JSON.stringify(formatted, null, 2));
      throw new Error(`Input Validation Error at ${swapAppService.name}`);
    }

    const validatedSwapAppService = result.data as ISwapAppService;
    if (!validatedSwapAppService.appSettings) validatedSwapAppService.appSettings = [];
    if (!validatedSwapAppService.connectionStrings) validatedSwapAppService.connectionStrings = [];
    return validatedSwapAppService;
  }
}
