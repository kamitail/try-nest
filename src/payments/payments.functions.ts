import { all, filter } from 'ramda';
import { Balance } from './payments.dto';

export const isPaymentFullyCovered = ({
  expectedCost,
  amountCovered,
}: Balance) => expectedCost <= amountCovered;

export const getUncoveredPayments = filter(
  ({ amountCovered }: Balance) => amountCovered === 0,
);

export const arePaymentsRelated =
  (checkedPayment: Balance) => (relatedPayment: Balance) =>
    checkedPayment.receiver.id === relatedPayment.payer.id &&
    !isPaymentFullyCovered(relatedPayment) &&
    relatedPayment.expectedCost - relatedPayment.amountCovered >=
      checkedPayment.expectedCost;

export const areAllPaymentsTouched = all(
  ({ amountCovered, expectedCost }: Balance) =>
    amountCovered === expectedCost || amountCovered === 0,
);
