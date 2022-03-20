export class RelatedPayment {
  destiny: number;
  value: number;
}

export class Payment {
  id?: number;
  payer_id?: number;
  receiver_id?: number;
  expectedCost?: number;
  total_paid?: number;
  fullInspect?: number;
  relatedPayments?: (number | RelatedPayment)[];
  a?: RelatedPayment[];
}
