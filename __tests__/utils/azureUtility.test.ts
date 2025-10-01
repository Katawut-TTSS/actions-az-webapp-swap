import { expect, it, describe } from '@jest/globals';
import { buildAzCommandOptions } from '../../src/utils/azureUtility';

describe('azureUtility', () => {
  describe('buildAzCommandOptions', () => {
    it('should return empty strings if no options are provided', () => {
      const options = {};
      const result = buildAzCommandOptions(options);
      expect(result.azSubscriptionCommand).toBe('');
      expect(result.azSlotCommand).toBe('');
    });

    it('should return only subscription command if subscriptionId is provided', () => {
      const options = { subscriptionId: 'test-sub-id' };
      const result = buildAzCommandOptions(options);
      expect(result.azSubscriptionCommand).toBe('--subscription test-sub-id');
      expect(result.azSlotCommand).toBe('');
    });

    it('should return only slot command if slot is provided and not production', () => {
      const options = { slot: 'staging' };
      const result = buildAzCommandOptions(options);
      expect(result.azSubscriptionCommand).toBe('');
      expect(result.azSlotCommand).toBe('--slot staging');
    });

    it('should return both subscription and slot commands if both are provided and slot is not production', () => {
      const options = { subscriptionId: 'test-sub-id', slot: 'staging' };
      const result = buildAzCommandOptions(options);
      expect(result.azSubscriptionCommand).toBe('--subscription test-sub-id');
      expect(result.azSlotCommand).toBe('--slot staging');
    });

    it('should return empty slot command if slot is production', () => {
      const options = { slot: 'production' };
      const result = buildAzCommandOptions(options);
      expect(result.azSubscriptionCommand).toBe('');
      expect(result.azSlotCommand).toBe('');
    });

    it('should return only subscription command if subscriptionId is provided and slot is production', () => {
      const options = { subscriptionId: 'test-sub-id', slot: 'production' };
      const result = buildAzCommandOptions(options);
      expect(result.azSubscriptionCommand).toBe('--subscription test-sub-id');
      expect(result.azSlotCommand).toBe('');
    });
  });
});
