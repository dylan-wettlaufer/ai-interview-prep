// utils/user.ts
export const getUser = () => {
    if (typeof window === "undefined") return null; // avoids SSR errors
  
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  };
  
  export const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  };
  
  export const clearUser = () => {
    localStorage.removeItem("user");
  };
  