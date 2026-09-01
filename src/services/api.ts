import { 
  PaymentMethod, 
  InvestmentPlan, 
  PlatformConfig, 
  UserAccount, 
  AdminAuditLogItem, 
  AdminDepositItem, 
  AdminWithdrawalItem 
} from '../types';

const API_BASE = '/api';

async function safeFetchJson(url: string, options?: RequestInit, defaultErrorMessage = 'Request failed'): Promise<any> {
  const res = await fetch(url, options);
  const text = await res.text();
  let data: any = {};
  try {
    data = JSON.parse(text);
  } catch {
    if (!res.ok) {
      const cleanText = text.replace(/<[^>]*>/g, '').trim();
      throw new Error(cleanText || `Server returned error status (${res.status})`);
    }
  }
  if (!res.ok) {
    throw new Error(data.error || data.message || defaultErrorMessage);
  }
  return data;
}

export const api = {
  // Public
  async getSettings(): Promise<PlatformConfig> {
    const data = await safeFetchJson(`${API_BASE}/settings`, undefined, 'Failed to load settings');
    return data.settings;
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const data = await safeFetchJson(`${API_BASE}/payment-methods`, undefined, 'Failed to load payment methods');
    return data.paymentMethods;
  },

  async getPlans(): Promise<InvestmentPlan[]> {
    const data = await safeFetchJson(`${API_BASE}/plans`, undefined, 'Failed to load plans');
    return data.plans;
  },

  // User Auth
  async register(body: { name: string; username?: string; email: string; password: string; confirmPassword?: string; referralCode?: string }): Promise<{ token: string; user: UserAccount }> {
    return await safeFetchJson(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }, 'Registration failed');
  },

  async login(body: { identifier?: string; email?: string; password: string }): Promise<{ token: string; user: UserAccount }> {
    return await safeFetchJson(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }, 'Login failed');
  },

  async getMe(token: string): Promise<UserAccount> {
    const data = await safeFetchJson(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }, 'Session expired');
    return data.user;
  },

  async logout(token: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      // ignore
    }
  },

  async forgotPassword(email: string): Promise<string> {
    const data = await safeFetchJson(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }, 'Password reset failed');
    return data.message;
  },

  async changePassword(token: string, currentPassword: string, newPassword: string): Promise<string> {
    const data = await safeFetchJson(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    }, 'Password update failed');
    return data.message;
  },

  async submitDeposit(token: string, depositData: { amountUsd: number; paymentMethodId: string; txHash?: string }): Promise<any> {
    return await safeFetchJson(`${API_BASE}/user/deposits`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(depositData),
    }, 'Deposit submission failed');
  },

  async submitWithdrawal(token: string, withdrawalData: { amountUsd: number; destinationAddress: string; currency?: string; network?: string }): Promise<any> {
    return await safeFetchJson(`${API_BASE}/user/withdrawals`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(withdrawalData),
    }, 'Withdrawal submission failed');
  },

  // Admin Auth
  async adminLogin(body: { email?: string; username?: string; passkey?: string; password?: string; twoFactorCode?: string }): Promise<{ token: string; admin: any }> {
    return await safeFetchJson(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }, 'Admin login failed');
  },

  async adminCheckToken(token: string): Promise<any> {
    const data = await safeFetchJson(`${API_BASE}/admin/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }, 'Admin session expired');
    return data.admin;
  },

  async adminLogout(token: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/admin/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      // ignore
    }
  },

  async changeAdminCredentials(
    token: string,
    payload: { currentPassword?: string; newEmail?: string; newUsername?: string; newPassword?: string }
  ): Promise<{ message: string; admin: any }> {
    return await safeFetchJson(`${API_BASE}/admin/change-credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }, 'Failed to update admin credentials');
  },

  // Admin Payment Methods
  async adminGetPaymentMethods(token: string): Promise<PaymentMethod[]> {
    const data = await safeFetchJson(`${API_BASE}/admin/payment-methods`, {
      headers: { Authorization: `Bearer ${token}` }
    }, 'Failed to fetch payment methods');
    return data.paymentMethods;
  },

  async adminAddPaymentMethod(token: string, payload: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const data = await safeFetchJson(`${API_BASE}/admin/payment-methods`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(payload),
    }, 'Failed to add payment method');
    return data.paymentMethod;
  },

  async adminUpdatePaymentMethod(token: string, id: string, payload: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const data = await safeFetchJson(`${API_BASE}/admin/payment-methods/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(payload),
    }, 'Failed to update payment method');
    return data.paymentMethod;
  },

  async adminDeletePaymentMethod(token: string, id: string): Promise<void> {
    await safeFetchJson(`${API_BASE}/admin/payment-methods/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }, 'Failed to delete payment method');
  },

  // Admin Plans
  async adminGetPlans(token: string): Promise<InvestmentPlan[]> {
    const data = await safeFetchJson(`${API_BASE}/admin/plans`, {
      headers: { Authorization: `Bearer ${token}` }
    }, 'Failed to load plans');
    return data.plans;
  },

  async adminAddPlan(token: string, payload: Partial<InvestmentPlan>): Promise<InvestmentPlan> {
    const data = await safeFetchJson(`${API_BASE}/admin/plans`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(payload),
    }, 'Failed to add plan');
    return data.plan;
  },

  async adminUpdatePlan(token: string, id: string, payload: Partial<InvestmentPlan>): Promise<InvestmentPlan> {
    const data = await safeFetchJson(`${API_BASE}/admin/plans/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(payload),
    }, 'Failed to update plan');
    return data.plan;
  },

  async adminDeletePlan(token: string, id: string): Promise<void> {
    await safeFetchJson(`${API_BASE}/admin/plans/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }, 'Failed to delete plan');
  },

  // Admin Settings
  async adminGetSettings(token: string): Promise<PlatformConfig> {
    const data = await safeFetchJson(`${API_BASE}/admin/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    }, 'Failed to load settings');
    return data.settings;
  },

  async adminUpdateSettings(token: string, payload: Partial<PlatformConfig>): Promise<PlatformConfig> {
    const data = await safeFetchJson(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(payload),
    }, 'Failed to update settings');
    return data.settings;
  },

  // Admin Users
  async adminGetUsers(token: string, params?: { search?: string; role?: string; status?: string }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.role) query.set('role', params.role);
    if (params?.status) query.set('status', params.status);

    const data = await safeFetchJson(`${API_BASE}/admin/users?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    }, 'Failed to load users');
    return data.users;
  },

  async adminGetUser(token: string, id: string): Promise<UserAccount> {
    const data = await safeFetchJson(`${API_BASE}/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }, 'Failed to load user details');
    return data.user;
  },

  async adminUpdateUserStatus(token: string, id: string, status: string, role?: string): Promise<any> {
    const data = await safeFetchJson(`${API_BASE}/admin/users/${id}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ status, role }),
    }, 'Failed to update user status');
    return data.user;
  },

  async adminAdjustBalance(token: string, id: string, amount: number, actionType: 'credit' | 'debit' | 'set', note?: string): Promise<number> {
    const data = await safeFetchJson(`${API_BASE}/admin/users/${id}/balance`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ amount, actionType, note }),
    }, 'Failed to adjust balance');
    return data.newBalance;
  },

  async adminResetPassword(token: string, id: string, newPassword?: string): Promise<string> {
    const data = await safeFetchJson(`${API_BASE}/admin/users/${id}/reset-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ newPassword }),
    }, 'Failed to reset password');
    return data.temporaryPassword;
  },

  // Admin Deposits
  async adminGetDeposits(token: string): Promise<AdminDepositItem[]> {
    const data = await safeFetchJson(`${API_BASE}/admin/deposits`, {
      headers: { Authorization: `Bearer ${token}` }
    }, 'Failed to load deposits');
    return data.deposits;
  },

  async adminApproveDeposit(token: string, id: string, adminNote?: string): Promise<AdminDepositItem> {
    const data = await safeFetchJson(`${API_BASE}/admin/deposits/${id}/approve`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ adminNote }),
    }, 'Failed to approve deposit');
    return data.deposit;
  },

  async adminRejectDeposit(token: string, id: string, adminNote?: string): Promise<AdminDepositItem> {
    const data = await safeFetchJson(`${API_BASE}/admin/deposits/${id}/reject`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ adminNote }),
    }, 'Failed to reject deposit');
    return data.deposit;
  },

  // Admin Withdrawals
  async adminGetWithdrawals(token: string): Promise<AdminWithdrawalItem[]> {
    const data = await safeFetchJson(`${API_BASE}/admin/withdrawals`, {
      headers: { Authorization: `Bearer ${token}` }
    }, 'Failed to load withdrawals');
    return data.withdrawals;
  },

  async adminApproveWithdrawal(token: string, id: string, txHash?: string, adminNote?: string): Promise<AdminWithdrawalItem> {
    const data = await safeFetchJson(`${API_BASE}/admin/withdrawals/${id}/approve`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ txHash, adminNote }),
    }, 'Failed to approve withdrawal');
    return data.withdrawal;
  },

  async adminRejectWithdrawal(token: string, id: string, adminNote?: string): Promise<AdminWithdrawalItem> {
    const data = await safeFetchJson(`${API_BASE}/admin/withdrawals/${id}/reject`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ adminNote }),
    }, 'Failed to reject withdrawal');
    return data.withdrawal;
  },

  async adminBatchApproveWithdrawals(token: string, withdrawalIds: string[]): Promise<string> {
    const data = await safeFetchJson(`${API_BASE}/admin/withdrawals/batch-approve`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ withdrawalIds }),
    }, 'Failed to batch approve withdrawals');
    return data.message;
  },

  // Admin Audit Logs
  async adminGetAuditLogs(token: string): Promise<AdminAuditLogItem[]> {
    const data = await safeFetchJson(`${API_BASE}/admin/audit-logs`, {
      headers: { Authorization: `Bearer ${token}` }
    }, 'Failed to load audit logs');
    return data.auditLogs;
  },

  async syncUser(token: string, data: { walletBalanceUsd?: number; totalEarnedUsd?: number; deposits?: any[] }): Promise<UserAccount> {
    const d = await safeFetchJson(`${API_BASE}/user/sync`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data),
    }, 'Failed to sync user state');
    return d.user;
  }
};
