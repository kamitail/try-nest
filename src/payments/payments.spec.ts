import { Balance } from './payments.dto';
import {
  areAllPaymentsTouched,
  arePaymentsRelated,
  getUncoveredPayments,
  isPaymentFullyCovered,
} from './payments.functions';

describe('PaymentsController', () => {
  describe('Check if payment fully covered', () => {
    it('should return false when expected cost larger than amount covered', () => {
      expect(
        isPaymentFullyCovered({ expectedCost: 30.25, amountCovered: 20.5 }),
      ).toBeFalsy;
    });
    it('should return true when expected cost equal to the amount covered', () => {
      expect(
        isPaymentFullyCovered({ expectedCost: 30.25, amountCovered: 30.25 }),
      ).toBeTruthy;
    });
  });
  describe('Check if payment is uncovered', () => {
    it('should return empty array when amount covered is grater than 0', () => {
      expect(getUncoveredPayments([{ amountCovered: 20.5 }])).toEqual([]);
    });
    it('should return the same array when amount covered is 0', () => {
      expect(getUncoveredPayments([{ amountCovered: 0 }])).toEqual([
        { amountCovered: 0 },
      ]);
    });
  });
  describe('Check if payments are related', () => {
    const checkedPayment: Balance = {
      receiver: { id: 1 },
      expectedCost: 20.15,
    };
    const relatedPayment: Balance = {
      payer: { id: 1 },
      expectedCost: 30.25,
      amountCovered: 7.5,
    };
    it('should return false when receiverId is different than payerId', () => {
      expect(
        arePaymentsRelated({ ...checkedPayment, receiver: { id: 2 } })({
          ...relatedPayment,
        }),
      ).toBeFalsy;
    });
    it('should return false when payment is fully covered', () => {
      expect(
        arePaymentsRelated({ ...checkedPayment })({
          ...relatedPayment,
          amountCovered: 30.25,
        }),
      ).toBeFalsy;
    });
    it('should return false when checkedPayment is greater than realtedPayment', () => {
      expect(
        arePaymentsRelated({ ...checkedPayment, expectedCost: 25 })({
          ...relatedPayment,
        }),
      ).toBeFalsy;
    });
    it('should return true', () => {
      expect(arePaymentsRelated({ ...checkedPayment })({ ...relatedPayment }))
        .toBeTruthy;
    });
  });
  describe('Check if all payments fully covered or uncovered at all', () => {
    const payments: Balance[] = [
      { amountCovered: 0, expectedCost: 27 },
      { amountCovered: 20.15, expectedCost: 30.15 },
      { amountCovered: 30.15, expectedCost: 30.15 },
    ];
    it('should return false when a payment is half covered', () => {
      expect(areAllPaymentsTouched([payments[1]])).toBeFalsy;
    });
    it('should return true when a payment is not covered', () => {
      expect(areAllPaymentsTouched([payments[0]])).toBeTruthy;
    });
    it('should return true when a payment is fully covered', () => {
      expect(areAllPaymentsTouched([payments[2]])).toBeTruthy;
    });
  });
});
