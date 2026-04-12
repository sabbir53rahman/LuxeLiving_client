import { useAppSelector } from "./useRedux";

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth,
  );
  return { user, token, isAuthenticated, isLoading };
};
