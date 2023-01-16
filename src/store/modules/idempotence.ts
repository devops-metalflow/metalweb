import { defineStore } from 'pinia';
import { store } from '/@/store';
import { IDEMPOTENCE_TOKEN_NAME } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { GetIdempotenceToken } from '/@/api/sys/user';

interface IdempotenceState {
  idempotenceToken: string;
  idempotenceTokenName: string;
}

export const useIdempotenceStore = defineStore({
  id: 'idempotence',
  state: (): IdempotenceState => ({
    idempotenceToken: '',
    idempotenceTokenName: IDEMPOTENCE_TOKEN_NAME,
  }),
  getters: {
    getIdempotenceToken(): string {
      return this.idempotenceToken || getAuthCache<string>(IDEMPOTENCE_TOKEN_NAME);
    },
  },
  actions: {
    setIdempotenceToken(token: string) {
      this.idempotenceToken = token;
      setAuthCache(IDEMPOTENCE_TOKEN_NAME, token);
    },
    /**
     * @description: RefreshIdempotenceToken
     */
    async RefreshIdempotenceToken() {
      // 刷新token
      const data = await GetIdempotenceToken();
      this.setIdempotenceToken(data);
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useIdempotenceStore(store);
}
