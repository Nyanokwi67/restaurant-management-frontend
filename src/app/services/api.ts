import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = 'http://localhost:3000';

// ===== EXPORTED TYPES =====
export interface User {
  id: number;
  name: string;
  username: string;
  role: string;
  active: boolean;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

export interface Table {
  id: number;
  number: number;
  seats: number;
  status: string;
}

export interface Order {
  id: number;
  tableId: number;
  tableNumber: number;
  waiterId: number;
  waiterName: string;
  items: string;
  total: number;
  status: string;
  paymentMethod?: string;
  timestamp: Date;
}

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  method: string;
  status: string;
  transactionId?: string;
  phoneNumber?: string;
  timestamp: Date;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  submittedBy: string;
  status: string;
  date: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaystackInitializeResponse {
  success: boolean;
  authorization_url: string;
  reference: string;
}

export interface PaystackVerifyResponse {
  success: boolean;
  message: string;
  data: any;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  keepUnusedDataFor: 300,
  refetchOnMountOrArgChange: 30,
  tagTypes: ['User', 'MenuItem', 'Table', 'Order', 'Payment', 'Expense'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
      keepUnusedDataFor: 300,
    }),

    createUser: builder.mutation({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),

    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    getMenuItems: builder.query({
      query: () => '/menu-items',
      providesTags: ['MenuItem'],
      keepUnusedDataFor: 300,
    }),

    createMenuItem: builder.mutation({
      query: (newItem) => ({
        url: '/menu-items',
        method: 'POST',
        body: newItem,
      }),
      invalidatesTags: ['MenuItem'],
    }),

    updateMenuItem: builder.mutation({
      query: ({ id, data }) => ({
        url: `/menu-items/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['MenuItem'],
    }),

    deleteMenuItem: builder.mutation({
      query: (id) => ({
        url: `/menu-items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MenuItem'],
    }),

    getTables: builder.query({
      query: () => '/tables',
      providesTags: ['Table'],
      keepUnusedDataFor: 120,
    }),

    getTable: builder.query({
      query: (id) => `/tables/${id}`,
      providesTags: ['Table'],
      keepUnusedDataFor: 120,
    }),

    createTable: builder.mutation({
      query: (newTable) => ({
        url: '/tables',
        method: 'POST',
        body: newTable,
      }),
      invalidatesTags: ['Table'],
    }),

    updateTable: builder.mutation({
      query: ({ id, data }) => ({
        url: `/tables/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Table', 'Order'],
    }),

    deleteTable: builder.mutation({
      query: (id) => ({
        url: `/tables/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Table'],
    }),

    getOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
      keepUnusedDataFor: 120,
    }),

    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ['Order'],
      keepUnusedDataFor: 120,
    }),

    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: '/orders',
        method: 'POST',
        body: newOrder,
      }),
      invalidatesTags: ['Order', 'Table'],
    }),

    updateOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Order', 'Table'],
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order', 'Table'],
    }),

    getPayments: builder.query({
      query: () => '/payments',
      providesTags: ['Payment'],
    }),

    getPaymentsByOrder: builder.query({
      query: (orderId) => `/payments/order/${orderId}`,
      providesTags: ['Payment'],
    }),

    getPayment: builder.query({
      query: (id) => `/payments/${id}`,
      providesTags: ['Payment'],
    }),

    createPayment: builder.mutation({
      query: (payment) => ({
        url: '/payments',
        method: 'POST',
        body: payment,
      }),
      invalidatesTags: ['Payment', 'Order'],
    }),

    updatePayment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/payments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Payment'],
    }),

    deletePayment: builder.mutation({
      query: (id) => ({
        url: `/payments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Payment'],
    }),

    getExpenses: builder.query({
      query: () => '/expenses',
      providesTags: ['Expense'],
    }),

    getExpense: builder.query({
      query: (id) => `/expenses/${id}`,
      providesTags: ['Expense'],
    }),

    createExpense: builder.mutation({
      query: (expense) => ({
        url: '/expenses',
        method: 'POST',
        body: expense,
      }),
      invalidatesTags: ['Expense'],
    }),

    updateExpense: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/expenses/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Expense'],
    }),

    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expense'],
    }),

    initiateMpesaPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/mpesa/stk-push',
        method: 'POST',
        body: paymentData,
      }),
    }),

    initializePaystackPayment: builder.mutation({
      query: (data: { 
        orderId: number; 
        email: string; 
        amount: number;
        channel?: 'card' | 'mobile_money';
        phoneNumber?: string;
      }) => ({
        url: '/payments/paystack/initialize',
        method: 'POST',
        body: data,
      }),
    }),

    verifyPaystackPayment: builder.query({
      query: (reference: string) => `/payments/paystack/verify/${reference}`,
      providesTags: ['Payment'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useGetTablesQuery,
  useGetTableQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetPaymentsQuery,
  useGetPaymentsByOrderQuery,
  useGetPaymentQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useGetExpensesQuery,
  useGetExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useInitiateMpesaPaymentMutation,
  useInitializePaystackPaymentMutation,
  useVerifyPaystackPaymentQuery,
} = api;