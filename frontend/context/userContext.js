import axios from "axios";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const userContext = createContext();
axios.defaults.withCredentials = true;

export const UserContextProvider = ({ children }) => {
  const serverUrl = "http://localhost:8000";

  const router = useRouter();

  const [user, setUser] = useState({});
  console.log("USER====>", user);
  const [allUsers, setAllUsers] = useState([]);
  const [userState, setUserState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loginStatus = async () => {
      const isLoggedIn = await userLoginStatus();

      if (isLoggedIn) {
        await getUser();
      }
    };

    loginStatus();
  }, []);

  useEffect(() => {
    if (user.role == "admin") {
      getAllUsers();
    }
  }, [user]);

  const registerUser = async (data) => {
    try {
      const res = await axios.post(`${serverUrl}/api/v1/user/register`, data);
      console.log("User registered successfully", res.data);
      toast.success("User registered successfully");

      setUserState({
        name: "",
        email: "",
        password: "",
      });

      router.push("/login");
    } catch (error) {
      console.log("Error registering a user", error);
      toast.error(error.response.data.message);
    }
  };

  const loginUser = async (data) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/user/login`,
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );

      toast.success("User logged in successfully");

      setUserState({
        email: "",
        password: "",
      });

      await getUser();

      router.push("/");
    } catch (error) {
      console.log("Error while logging a user", error);
      toast.error(error.response.data.message);
    }
  };

  const logOutUser = async (data) => {
    try {
      const logout = await axios.get(`${serverUrl}/api/v1/user//logout`, {
        withCredentials: true,
      });

      toast.success("User logged out successfully");

      // redirect to login page
      router.push("/login");
    } catch (error) {
      console.log("Error while logging out a user", error);
      toast.error(error.response.data.message);
    }
  };

  const getUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/user/user`, {
        withCredentials: true,
      });

      setUser((prevState) => {
        return {
          ...prevState,
          ...res.data.data,
        };
      });
    } catch (error) {
      console.log("Error while getting a user", error);
      toast.error(error.response.data.message);
    }
  };

  const userLoginStatus = async () => {
    let loggedIn = false;
    try {
      const res = await axios.get(`${serverUrl}/api/v1/user/login-status`, {
        withCredentials: true, // send cookies to the server
      });

      // coerce the string to boolean
      loggedIn = !!res.data;

      if (!loggedIn) {
        router.push("/login");
      }
    } catch (error) {
      console.log("Error getting user login status", error);
    }

    return loggedIn;
  };

  const updateUser = async (e, data) => {
    e.preventDefault();
    console.log(data);
    try {
      const res = await axios.patch(`${serverUrl}/api/v1/user/update`, data, {
        withCredentials: true, // send cookies to the server
      });

      // update the user state
      setUser((prevState) => {
        return {
          ...prevState,
          ...res.data,
        };
      });

      toast.success("User updated successfully");
    } catch (error) {
      console.log("Error updating user details", error);
      toast.error(error.response.data.message);
    }
  };

  const emailVerification = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/user/verify-email`,
        {},
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("Email verification sent successfully");
    } catch (error) {
      console.log("Error sending email verification", error);
      toast.error(error.response.data.message);
    }
  };

  const verifyUser = async (token) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/user/verify-user/${token}`,
        {},
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("User verified successfully");

      // refresh the user details
      getUser();

      // redirect to home page
      router.push("/");
    } catch (error) {
      console.log("Error verifying user", error);
      toast.error(error.response.data.message);
    }
  };

  // forgot password email
  const forgotPasswordEmail = async (email) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/user/forget-password`,
        {
          email,
        },
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("Forgot password email sent successfully");
    } catch (error) {
      console.log("Error sending forgot password email", error);
      toast.error(error.response.data.message);
    }
  };

  // reset password
  const resetPassword = async (token, password) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/reset-password/${token}`,
        {
          password,
        },
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("Password reset successfully");
      // redirect to login page
      router.push("/login");
    } catch (error) {
      console.log("Error resetting password", error);
      toast.error(error.response.data.message);
    }
  };

  // change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await axios.patch(
        `${serverUrl}/api/v1/user/change-password`,
        { currentPassword, newPassword },
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("Password changed successfully");
    } catch (error) {
      console.log("Error changing password", error);
      toast.error(error.response.data.message);
    }
  };

  // Admin routes
  const getAllUsers = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/v1/admin/users`,
        {},
        {
          withCredentials: true, // send cookies to the server
        }
      );
      console.log(res.data);

      setAllUsers(res.data.data);
    } catch (error) {
      console.log("Error getting all users", error);
      toast.error(error.response.data.message);
    }
  };

  // delete user
  const deleteUser = async (id) => {
    try {
      const res = await axios.delete(
        `${serverUrl}/api/v1/admin/users/${id}`,
        {},
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("User deleted successfully");
      // refresh the users list
      getAllUsers();
    } catch (error) {
      console.log("Error deleting user", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <userContext.Provider
      value={{
        registerUser,
        loginUser,
        logOutUser,
        user,
        updateUser,
        allUsers,
        emailVerification,
        forgotPasswordEmail,
        resetPassword,
        changePassword,
        verifyUser,
        deleteUser,
        userLoginStatus,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(userContext);
};
