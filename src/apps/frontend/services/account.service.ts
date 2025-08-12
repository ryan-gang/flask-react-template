import APIService from 'frontend/services/api.service';
import { Account, AccessToken, ApiResponse } from 'frontend/types';
import { getAccessTokenFromStorage } from 'frontend/utils/storage-util';

export default class AccountService extends APIService {
  getAccountDetails = async (
    userAccessToken: AccessToken,
  ): Promise<ApiResponse<Account>> =>
    this.apiClient.get(`/accounts/${userAccessToken.accountId}`, {
      headers: {
        Authorization: `Bearer ${userAccessToken.token}`,
      },
    });

  getAccountById = async (accountId: string): Promise<ApiResponse<Account>> => {
    const accessToken = getAccessTokenFromStorage();
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    return this.apiClient.get(`/accounts/${accountId}`, {
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    });
  };
}
