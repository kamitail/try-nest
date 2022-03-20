import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  all,
  any,
  concat,
  equals,
  filter,
  find,
  has,
  last,
  map,
  count,
  uniq,
  groupBy,
  pipe,
  reduce,
  values,
} from 'ramda';
import { Payment, RelatedPayment } from './payment.dto';
import payments from './payments';

const isPaymentFullfield = ({ expectedCost, fullInspect }: Payment) =>
  expectedCost > fullInspect;

const getUntouchedPayments = filter(
  (payment: Payment) => payment.fullInspect === 0,
);

const arePaymentsRelated =
  (checkedPayment: Payment) =>
  (relPayment: Payment): boolean =>
    checkedPayment.receiver_id === relPayment.payer_id &&
    isPaymentFullfield(relPayment) &&
    relPayment.expectedCost - relPayment.fullInspect >=
      checkedPayment.expectedCost;

const areAllPaymentsTouched = all(
  ({ fullInspect, expectedCost }: Payment) =>
    fullInspect === expectedCost || fullInspect === 0,
);

const mergeSameRelatePayments = (payment: Payment): RelatedPayment[] => {
  const uniqueRelatedPayments = uniq(payment.relatedPayments);
  const getTotalValue = (relatedPayment: number) =>
    count(equals(relatedPayment), payment.relatedPayments) *
    payment.expectedCost;

  return map(
    (realtedPayment: number): RelatedPayment => ({
      destiny: realtedPayment,
      value: getTotalValue(realtedPayment),
    }),
    uniqueRelatedPayments,
  );
};

const mergeSameContactsPayments = (payments: Payment[]): Payment[] => {
  const sameContactsPayments: Record<string, Payment[]> = groupBy(
    ({ payer_id, receiver_id }: Payment): string =>
      `${payer_id},${receiver_id}`,
    payments,
  );
  const mergedPayments = map(
    (samePaymentsGroup) =>
      reduce(
        (acc: Payment, payment: Payment): Payment => ({
          ...payment,
          expectedCost: payment.expectedCost + acc.expectedCost,
          a: concat(acc.a, payment.a),
        }),
        { expectedCost: 0, a: [] },
        samePaymentsGroup,
      ),
    values(sameContactsPayments),
  );

  return mergedPayments;
};

@Injectable()
export class AppService {
  splitMoney() {
    let relevantPayments: Payment[] = [
      ...map(
        (payment: Payment) => ({
          ...payment,
          fullInspect: 0,
          expectedCost: payment.expectedCost - payment.total_paid,
        }),
        payments,
      ),
    ];

    while (
      !areAllPaymentsTouched(relevantPayments) ||
      any(
        (currPayment) =>
          any(
            arePaymentsRelated(currPayment),
            getUntouchedPayments(relevantPayments),
          ) || !has('relatedPayments', currPayment),
        getUntouchedPayments(relevantPayments),
      )
    ) {
      relevantPayments = filter(isPaymentFullfield, relevantPayments);
      const [payment]: Payment[] = relevantPayments;
      const checkedPayment: Payment = {
        ...payment,
        expectedCost: payment.expectedCost - payment.fullInspect,
        relatedPayments: [...(payment.relatedPayments || []), payment.id],
      };
      payment.fullInspect = payment.expectedCost;
      let isPaymentRelatable = true;

      while (isPaymentRelatable) {
        const relatedPayment = find(
          arePaymentsRelated(checkedPayment),
          relevantPayments,
        );

        relatedPayment
          ? ((relatedPayment.fullInspect += checkedPayment.expectedCost),
            (checkedPayment.receiver_id = relatedPayment.receiver_id),
            (checkedPayment.relatedPayments = concat(
              checkedPayment.relatedPayments,
              relatedPayment.relatedPayments || [relatedPayment.id],
            )))
          : (isPaymentRelatable = false);
      }

      relevantPayments.push({
        ...checkedPayment,
        id: last(relevantPayments).id + 1,
        fullInspect: 0,
        total_paid: 0,
      });
    }

    return pipe(
      map(
        (payment: Payment): Payment => ({
          ...payment,
          a: mergeSameRelatePayments(payment),
        }),
      ),
      mergeSameContactsPayments,
    )(getUntouchedPayments(relevantPayments));
  }

  getHello(): string {
    throw new HttpException('Hi', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
