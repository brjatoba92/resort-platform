import { api } from './index';

interface Payment {
  id: string;
  reservationId: string;
  guestId: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'pix';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  refundReason?: string;
}

interface CreatePaymentData {
  reservationId: string;
  amount: number;
  currency: string;
  method: Payment['method'];
  paymentDetails: {
    cardNumber?: string;
    cardHolder?: string;
    expirationDate?: string;
    cvv?: string;
    pixKey?: string;
    bankDetails?: {
      bank: string;
      branch: string;
      account: string;
    };
  };
}

interface PaymentFilters {
  status?: Payment['status'];
  method?: Payment['method'];
  startDate?: string;
  endDate?: string;
  guestId?: string;
  reservationId?: string;
}

interface PaymentMethod {
  method: Payment['method'];
  enabled: boolean;
  fees: number;
}

interface PaymentValidation {
  valid: boolean;
  errors?: string[];
}

interface PaymentReceipt {
  receiptUrl: string;
  expiresAt: string;
}

export const paymentService = {
  async getAll(filters?: PaymentFilters): Promise<Payment[]> {
    const response = await api.get<Payment[]>('/payments', {
      params: filters,
    });
    return response.data;
  },

  async getById(id: string): Promise<Payment> {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  async create(data: CreatePaymentData): Promise<Payment> {
    const response = await api.post<Payment>('/payments', data);
    return response.data;
  },

  async processRefund(paymentId: string, reason: string): Promise<Payment> {
    const response = await api.post<Payment>(`/payments/${paymentId}/refund`, { reason });
    return response.data;
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await api.get<PaymentMethod[]>('/payments/methods');
    return response.data;
  },

  async validatePaymentDetails(
    method: Payment['method'],
    details: CreatePaymentData['paymentDetails']
  ): Promise<PaymentValidation> {
    const response = await api.post<PaymentValidation>('/payments/validate', { method, details });
    return response.data;
  },

  async getPaymentReceipt(paymentId: string): Promise<PaymentReceipt> {
    const response = await api.get<PaymentReceipt>(`/payments/${paymentId}/receipt`);
    return response.data;
  },

  async getPaymentsByReservation(reservationId: string): Promise<Payment[]> {
    const response = await api.get<Payment[]>(`/payments/reservation/${reservationId}`);
    return response.data;
  },

  async getPaymentsByGuest(guestId: string): Promise<Payment[]> {
    const response = await api.get<Payment[]>(`/payments/guest/${guestId}`);
    return response.data;
  },
};