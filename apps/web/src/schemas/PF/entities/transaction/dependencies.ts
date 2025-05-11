import { DependencyRule } from '@wl-apps/schema-to-ui';
import { TransactionInterval } from '@wl-apps/types';
import { transactionRecurOnConfig } from './bit-flags';

export const recurFrequencyDependencies: DependencyRule[] = [
  {
    field: 'recurInterval',
    operator: 'equals',
    value: TransactionInterval.NONRECURRING,
    effect: {
      hide: true,
      setValue: 0
    }
  },
  {
    field: 'recurInterval',
    operator: 'notEquals',
    value: TransactionInterval.NONRECURRING,
    effect: {
      hide: false, setValue: 1
    }
  }
];

export const recurOnDependencies: DependencyRule[] = [
  // Hide when non-recurring
  {
    field: 'recurInterval',
    operator: 'equals',
    value: TransactionInterval.NONRECURRING,
    effect: {
      hide: true, setValue: 0, disable: true
    }
  },
  {
    field: 'recurInterval',
    operator: 'equals',
    value: TransactionInterval.DAILY,
    effect: {
      hide: true, setValue: 1, disable: true
    }
  },
  // Show weekly options
  {
    field: 'recurInterval',
    operator: 'equals',
    value: TransactionInterval.WEEKLY,
    effect: {
      hide: false, disable: false,
      setOptionGroups: [transactionRecurOnConfig.groups.daysOfWeek]
    }
  },
  // Show monthly options
  {
    field: 'recurInterval',
    operator: 'equals',
    value: TransactionInterval.MONTHLY,
    effect: {
      hide: false, disable: false,
      setOptionGroups: [transactionRecurOnConfig.groups.daysOfMonth]
    }
  },
  // Show monthly-on options
  {
    field: 'recurInterval',
    operator: 'equals',
    value: TransactionInterval.MONTHLY_ON,
    effect: {
      hide: false, disable: false,
      setOptionGroups: [
        transactionRecurOnConfig.groups.weekOccurrence,
        transactionRecurOnConfig.groups.daysOfWeek
      ]
    }
  }
];
