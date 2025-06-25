import type { UserModel } from '@/model/user';
import { defineStore } from 'pinia';
import { getUserInfo as _getUserInfo, loginApi } from '@/api/login';
import { removeCacheToken, setCacheToken } from '@/utils/cache';

const SUPER_ADMIN = 'admin';

export const useUserStore = defineStore('user', () => {
  const userName = ref<UserModel | null>(null);
  const roles = ref<string[]>([]);
  const permissions = ref<string[]>([]);
  const avater = ref();

  return {
    userName,
    roles,
    permissions,
    avater,
    login,
    logout,
    getInfo,
    resetAllState,
    hasPermission,
    hasRole,
  };

  async function login(...args: Parameters<typeof loginApi>) {
    const res = await loginApi(...args);
    setCacheToken(res.accessToken);
  }
  function logout() {
    return new Promise<''>((resolve) => {
      resetAllState();
      removeCacheToken();
      resolve('');
    });
  }

  async function getInfo() {
    const res = await _getUserInfo();
    userName.value = { username: res.data.username };
    // roles.value = res.data.roles;
  }

  function resetAllState() {
    userName.value = null;
    roles.value = [];
    permissions.value = [];
    removeCacheToken();
  }

  function hasPermission(requiredPermission: string): boolean {
    return permissions.value.includes(requiredPermission);
  }

  function hasRole(requiredRole: string): boolean {
    if (roles.value.includes(SUPER_ADMIN))
      return true;
    return roles.value.includes(requiredRole);
  }
});
