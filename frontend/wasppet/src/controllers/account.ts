import { VAR } from "@/utils/variables";
import { userAuthWithoutAvatar } from "@/interfaces/general_use_interfaces";
import { changePassword } from "@/interfaces/general_use_interfaces";

// Controller to update the user data
export const updateUserData = async (
  data: userAuthWithoutAvatar
): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.USER.PUT}${data.id}/`;
    const params = {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, params);

    if (response.ok) {
      const result = await response.json();
      return { success: true, detail: result };
    }

    const result = await response.json();
    return { success: false, detail: result };
  } catch (error) {
    return { success: false, detail: error, message: "catch error" };
  }
};

export const changePasswordController = async (
  data: changePassword
): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.SESSION.CHANGEPASSWORD}`;
    const params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, params);

    if (response.ok) {
      const result = await response.json();
      return { success: true, detail: result };
    }

    const result = await response.json();
    return { success: false, detail: result };
  } catch (error) {
    return { success: false, detail: error, message: "catch error" };
  }
};

export const sendVerificationCode = async (data: {
  randomCode: string;
  new_email: string;
  password: string;
  current_email: string;
}): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.SESSION.SENDVERIFYCODE}`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, params);

    if (response.ok) {
      const result = await response.json();
      return { success: true, detail: result };
    }

    const result = await response.json();
    return { success: false, detail: result };
  } catch (error) {
    return { success: false, detail: error, message: "catch error" };
  }
};

export const forgotPasswordVerificationCode = async (data: {
  randomCode: string;
  email: string;
}): Promise<any> => {
  try {
    const url = `${VAR.BACKEND_URL}${VAR.API.SESSION.FORGOTPASSWORD}`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, params);

    if (response.ok) {
      const result = await response.json();
      return { success: true, detail: result };
    }

    const result = await response.json();
    return { success: false, detail: result };
  } catch (error) {
    return { success: false, detail: error, message: "catch error" };
  }
};

export const recoverPassword = async (data: {
  user_email: string;
  new_password: string;
}): Promise<any> => {
  try {
    const url = `${VAR.BACKEND_URL}${VAR.API.SESSION.RECOVERPASSWORD}`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, params);

    if (response.ok) {
      const result = await response.json();
      return { success: true, detail: result }
    }

    const result = await response.json();
    return { success: false, detail: result }

  } catch (error) {
    return { success: false, detail: error, message: "catch error" }
  }
};
