"use client";

import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch } from "@/hooks/useRedux";
import { setCredentials, setLoading, logout } from "@/redux/features/auth/authSlice";
import { User } from "@/types";
import { BASE_URL } from "@/constants";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  name?: string;
  exp: number;
}

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const token = getCookie("token");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);

        // Check if token is still valid
        if (decoded.exp * 1000 > Date.now()) {
          const user: User = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name || decoded.email,
            createdAt: new Date().toISOString(),
          };
          
          // Set initial credentials from token
          dispatch(setCredentials({ user, token }));
          
          // Determine the correct endpoint based on user role
          let endpoint = `${BASE_URL}/users/me`;
          if (decoded.role === 'agent') {
            endpoint = `${BASE_URL}/agents/me`;
          } else if (decoded.role === 'seller') {
            endpoint = `${BASE_URL}/sellers/me`;
          } else if (decoded.role === 'buyer') {
            endpoint = `${BASE_URL}/buyers/me`;
          }

          // Validate user exists in database
          fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(response => {
            if (!response.ok) {
              // User doesn't exist in database or token invalid
              throw new Error('User not found');
            }
            return response.json();
          })
          .then(data => {
            // User exists, update with fresh data
            if (data.success && data.data) {
              dispatch(setCredentials({ 
                user: data.data, 
                token 
              }));
            } else {
              throw new Error('Invalid response');
            }
          })
          .catch(() => {
            // User doesn't exist in database or server error, clear auth but avoid hard redirect during dev
            document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
            dispatch(logout());
          });
        } else {
          // Token expired - clear it
          document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
          dispatch(setLoading(false));
        }
      } catch {
        // Invalid token - clear it
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
        dispatch(setLoading(false));
      }
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return <>{children}</>;
}
