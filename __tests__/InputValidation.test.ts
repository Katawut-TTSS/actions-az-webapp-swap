import { expect, test } from '@jest/globals';
import InputValidation from '../src/validation/InputValidation';
import { DefaultSensitiveEnum, DefaultSlotSettingEnum, ISwapAppService, ResourceType } from '../src/interfaces';

const swapAppService: Partial<ISwapAppService> = {
  name: '',
  resourceGroup: '',
  slot: '',
  targetSlot: '',
  defaultSensitive: DefaultSensitiveEnum.true,
  defaultSlotSetting: DefaultSlotSettingEnum.required,
};

test('InputValidation.validate appSettings is undefined should return appSettings with empty list', () => {
  const actual = InputValidation.validate(swapAppService);

  const expected: Partial<ISwapAppService> = {
    ...swapAppService,
    appSettings: [],
    connectionStrings: [],
  };

  expect(actual).toStrictEqual(expected);
});

test('InputValidation.validate connectionStrings is undefined should return connectionStrings with empty list', () => {
  const actual = InputValidation.validate(swapAppService);

  const expected: Partial<ISwapAppService> = {
    ...swapAppService,
    appSettings: [],
    connectionStrings: [],
  };

  expect(actual).toStrictEqual(expected);
});

test('InputValidation.validateArray appSettings is undefined should return appSettings with empty list', () => {
  const actual = InputValidation.validateArray([swapAppService]);

  const expected: Partial<ISwapAppService>[] = [
    {
      ...swapAppService,
      appSettings: [],
      connectionStrings: [],
    },
  ];

  expect(actual).toStrictEqual(expected);
});

test('InputValidation.validateArray connectionStrings is undefined should return connectionStrings with empty list', () => {
  const actual = InputValidation.validateArray([swapAppService]);

  const expected: Partial<ISwapAppService>[] = [
    {
      ...swapAppService,
      appSettings: [],
      connectionStrings: [],
    },
  ];

  expect(actual).toStrictEqual(expected);
});

test('InputValidation.validate resourceType is undefined should pass validation', () => {
  const input: Partial<ISwapAppService> = { ...swapAppService };
  expect(() => InputValidation.validate(input)).not.toThrow();
});

test('InputValidation.validate resourceType is web_app should pass validation', () => {
  const input: Partial<ISwapAppService> = { ...swapAppService, resourceType: 'web_app' as ResourceType };
  expect(InputValidation.validate(input).resourceType).toBe('web_app');
});

test('InputValidation.validate resourceType is function_app should pass validation', () => {
  const input: Partial<ISwapAppService> = { ...swapAppService, resourceType: 'function_app' as ResourceType };
  expect(InputValidation.validate(input).resourceType).toBe('function_app');
});

test('InputValidation.validate legacy web_app alias should throw', () => {
  const input: Partial<ISwapAppService> = { ...swapAppService, resourceType: 'webapp' as never };
  expect(() => InputValidation.validate(input)).toThrow();
});

test('InputValidation.validate legacy function_app alias should throw', () => {
  const input: Partial<ISwapAppService> = { ...swapAppService, resourceType: 'functionapp' as never };
  expect(() => InputValidation.validate(input)).toThrow();
});

test('InputValidation.validate resourceType with invalid value should throw', () => {
  const input: Partial<ISwapAppService> = { ...swapAppService, resourceType: 'invalid' as ResourceType };
  expect(() => InputValidation.validate(input)).toThrow();
});
