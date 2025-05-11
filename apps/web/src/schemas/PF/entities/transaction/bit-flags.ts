import { createBitFlagConfig } from '@wl-apps/schema-to-ui';
import { RecurOnGroupKey, TransactionRecurOn } from '@wl-apps/types';

export const transactionRecurOnConfig = createBitFlagConfig<RecurOnGroupKey>({
  flagValue: 0,
  groups: {
    daysOfWeek: {
      label: 'Days of Week',
      options: [
        { value: TransactionRecurOn.ON_MONDAY, label: 'Monday' },
        { value: TransactionRecurOn.ON_TUESDAY, label: 'Tuesday' },
        { value: TransactionRecurOn.ON_WEDNESDAY, label: 'Wednesday' },
        { value: TransactionRecurOn.ON_THURSDAY, label: 'Thursday' },
        { value: TransactionRecurOn.ON_FRIDAY, label: 'Friday' },
        { value: TransactionRecurOn.ON_SATURDAY, label: 'Saturday' },
        { value: TransactionRecurOn.ON_SUNDAY, label: 'Sunday' }
      ]
    },
    daysOfMonth: {
      label: 'Days of Month',
      options: [
        { value: TransactionRecurOn.ON_1ST, label: '1st' },
        { value: TransactionRecurOn.ON_2ND, label: '2nd' },
        { value: TransactionRecurOn.ON_3RD, label: '3rd' },
        { value: TransactionRecurOn.ON_4TH, label: '4th' },
        { value: TransactionRecurOn.ON_5TH, label: '5th' },
        { value: TransactionRecurOn.ON_6TH, label: '6th' },
        { value: TransactionRecurOn.ON_7TH, label: '7th' },
        { value: TransactionRecurOn.ON_8TH, label: '8th' },
        { value: TransactionRecurOn.ON_9TH, label: '9th' },
        { value: TransactionRecurOn.ON_10TH, label: '10th' },
        { value: TransactionRecurOn.ON_11TH, label: '11th' },
        { value: TransactionRecurOn.ON_12TH, label: '12th' },
        { value: TransactionRecurOn.ON_13TH, label: '13th' },
        { value: TransactionRecurOn.ON_14TH, label: '14th' },
        { value: TransactionRecurOn.ON_15TH, label: '15th' },
        { value: TransactionRecurOn.ON_16TH, label: '16th' },
        { value: TransactionRecurOn.ON_17TH, label: '17th' },
        { value: TransactionRecurOn.ON_18TH, label: '18th' },
        { value: TransactionRecurOn.ON_19TH, label: '19th' },
        { value: TransactionRecurOn.ON_20TH, label: '20th' },
        { value: TransactionRecurOn.ON_21ST, label: '21st' },
        { value: TransactionRecurOn.ON_22ND, label: '22nd' },
        { value: TransactionRecurOn.ON_23RD, label: '23rd' },
        { value: TransactionRecurOn.ON_24TH, label: '24th' },
        { value: TransactionRecurOn.ON_25TH, label: '25th' },
        { value: TransactionRecurOn.ON_26TH, label: '26th' },
        { value: TransactionRecurOn.ON_27TH, label: '27th' },
        { value: TransactionRecurOn.ON_28TH, label: '28th' },
        { value: TransactionRecurOn.ON_29TH, label: '29th' },
        { value: TransactionRecurOn.ON_30TH, label: '30th' },
        { value: TransactionRecurOn.ON_31ST, label: '31st' },
        { value: TransactionRecurOn.ON_LASTDOM, label: 'Last Day of Month' }
      ]
    },
    months: {
      label: 'Months',
      options: [
        { value: TransactionRecurOn.ON_JANUARY, label: 'January' },
        { value: TransactionRecurOn.ON_FEBRUARY, label: 'February' },
        { value: TransactionRecurOn.ON_MARCH, label: 'March' },
        { value: TransactionRecurOn.ON_APRIL, label: 'April' },
        { value: TransactionRecurOn.ON_MAY, label: 'May' },
        { value: TransactionRecurOn.ON_JUNE, label: 'June' },
        { value: TransactionRecurOn.ON_JULY, label: 'July' },
        { value: TransactionRecurOn.ON_AUGUST, label: 'August' },
        { value: TransactionRecurOn.ON_SEPTEMBER, label: 'September' },
        { value: TransactionRecurOn.ON_OCTOBER, label: 'October' },
        { value: TransactionRecurOn.ON_NOVEMBER, label: 'November' },
        { value: TransactionRecurOn.ON_DECEMBER, label: 'December' }
      ]
    },
    weekOccurrence: {
      label: 'Week Occurrence',
      options: [
        { value: TransactionRecurOn.ON_FIRST, label: 'First' },
        { value: TransactionRecurOn.ON_SECOND, label: 'Second' },
        { value: TransactionRecurOn.ON_THIRD, label: 'Third' },
        { value: TransactionRecurOn.ON_FOURTH, label: 'Fourth' }
      ]
    }
  }
});
