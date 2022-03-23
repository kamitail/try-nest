import { User } from '../users/users.dto';

export class MainPayment {
  id?: number;
  cost?: number;
  reason?: string;
  payerId?: number;
  payer?: User;
  subPayments?: SubPayment[];
}

export class SubPayment {
  id?: number;
  expectedCost?: number;
  actuallyPaid?: number;
  payerId?: number;
  receiverId?: number;
  mainPaymentId?: number;
  mainPayment?: MainPayment;
  payer?: User;
  receiver?: User;
}

export class RelatedPayment {
  paymentId: number;
  cost: number;
}

export class Balance extends SubPayment {
  amountCovered?: number;
  relatedPayments?: RelatedPayment[];
}
