import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'http://localhost:3000/api';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    username: string;
    role: string;
  };
}

interface User {
  id: number;
  name: string;
  username: string;
  role: string;
  active: boolean;
}

interface CreateUserRequest {
  name: string;
  username: string;
  password: string;
  role: string;
  active: boolean;
}

interface UpdateUserRequest {
  name?: string;
  username?: string;
  password?: string;
  role?: string;
  active?: boolean;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

interface CreateMenuItemRequest {
  name: string;
  price: number;
  category: string;
  available: boolean;
}

interface Table {
  id: number;
  number: number;
  seats: number;
  status: string;
}

interface CreateTableRequest {
  number: number;
  seats: number;
  status: string;
}

interface Order {
  id: number;
  tableNumber: number;
  waiterName: string;
  total: number;
  status: string;
  paymentMethod?: string;
  timestamp: string;
  items?: string;
}

interface CreateOrderRequest {
  tableId: number;
  waiterId: number;
  items: string;
  total: number;
  status: string;
}

interface UpdateOrderRequest {
  status?: string;
  paymentMethod?: string;
}

interface MpesaRequest {
  phoneNumber: string;
  amount: number;
  orderId: number;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Users', 'MenuItems', 'Tables', 'Orders'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Users endpoints
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation<User, { id: number; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    // Menu Items endpoints
    getMenuItems: builder.query<MenuItem[], void>({
      query: () => '/menu-items',
      providesTags: ['MenuItems'],
    }),
    createMenuItem: builder.mutation<MenuItem, CreateMenuItemRequest>({
      query: (item) => ({
        url: '/menu-items',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['MenuItems'],
    }),
    updateMenuItem: builder.mutation<MenuItem, { id: number; data: Partial<CreateMenuItemRequest> }>({
      query: ({ id, data }) => ({
        url: `/menu-items/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['MenuItems'],
    }),
    deleteMenuItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `/menu-items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MenuItems'],
    }),

    // Tables endpoints
    getTables: builder.query<Table[], void>({
      query: () => '/tables',
      providesTags: ['Tables'],
    }),
    getTable: builder.query<Table, number>({
      query: (id) => `/tables/${id}`,
      providesTags: ['Tables'],
    }),
    createTable: builder.mutation<Table, CreateTableRequest>({
      query: (table) => ({
        url: '/tables',
        method: 'POST',
        body: table,
      }),
      invalidatesTags: ['Tables'],
    }),
    updateTable: builder.mutation<Table, { id: number; data: Partial<CreateTableRequest> }>({
      query: ({ id, data }) => ({
        url: `/tables/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Tables'],
    }),
    deleteTable: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tables/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tables'],
    }),

    // Orders endpoints
    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Orders'],
    }),
    getOrder: builder.query<Order, number>({
      query: (id) => `/orders/${id}`,
      providesTags: ['Orders'],
    }),
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Orders', 'Tables'],
    }),
    updateOrder: builder.mutation<Order, { id: number; data: UpdateOrderRequest }>({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Orders', 'Tables'],
    }),
    deleteOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders', 'Tables'],
    }),

    // M-Pesa endpoint
    initiateMpesaPayment: builder.mutation<any, MpesaRequest>({
      query: (data) => ({
        url: '/mpesa/stk-push',
        method: 'POST',
        body: data,
      }),
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
  useInitiateMpesaPaymentMutation,
} = api;