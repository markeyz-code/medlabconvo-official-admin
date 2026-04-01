import { ref, watch, computed } from "vue";
import { useCookie } from "#app";

const runtimeData = {
  auth: ref(),
  user: ref({} as any),
  token: ref(""),
};

export const useUser = () => {
  const tokenCookie = useCookie("token", { maxAge: 60 * 60 * 24 * 7 }); // 7 days
  const userCookie = useCookie<any>("user", { maxAge: 60 * 60 * 24 * 7 });

  const id = computed({
    get: () => runtimeData?.user?.value?.id ?? "",
    set: () => {},
  });

  const isLoggedIn = computed({
    get: () => {
      const hasToken = !!tokenCookie.value;
      const hasUser = !!userCookie.value && typeof userCookie.value === "object";
      return hasToken && hasUser;
    },
    set: () => {},
  });

  const isEmailVerified = computed(() => {
    return userCookie.value?.isEmailVerified;
  });

  const logOut = () => {
    tokenCookie.value = null;
    userCookie.value = null;
    runtimeData.token.value = "";
    runtimeData.user.value = null;
    // Redirect to login
    location.href = "/";
  };

  const setToken = (token: string) => {
    tokenCookie.value = token;
    runtimeData.token.value = token;
  };

  const createUser = (data: any) => {
    const access_token = data?.access_token;
    const userData = data?.user;

    tokenCookie.value = access_token;
    userCookie.value = userData;

    runtimeData.token.value = access_token;
    runtimeData.user.value = userData;
  };

  const updateUser = (newUser: any) => {
    const updatedUser = { ...userCookie.value, ...newUser };
    userCookie.value = updatedUser;
    runtimeData.user.value = updatedUser;
  };

  // Sync runtime data with cookies on initialization
  if (!runtimeData.token.value && tokenCookie.value) {
    runtimeData.token.value = tokenCookie.value;
  }
  if ((!runtimeData.user.value || Object.keys(runtimeData.user.value).length === 0) && userCookie.value) {
    runtimeData.user.value = userCookie.value;
  }

  return {
    id,
    isLoggedIn,
    isEmailVerified,
    createUser,
    ...runtimeData,
    logOut,
    updateUser,
    setToken,
    token: computed(() => tokenCookie.value || ""),
    user: computed(() => userCookie.value || {} as any),
  };
};
