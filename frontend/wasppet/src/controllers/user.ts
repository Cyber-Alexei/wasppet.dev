import { VAR } from "@/utils/variables";

export const getSingleUser = async ({ id }: { id: number }): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.USER.GET.SINGLE_USER}${id}/`;
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
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

export const getSingleUserByUsername = async ({
  username,
}: {
  username: string;
}): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.USER.GET.SINGLE_USER_BY_USERNAME}${username}/search-by-username/`;
    let params;
    if (token) {
      params = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
    } else {
      params = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    const response = await fetch(url, params);

    if (response.ok) {
        const result = await response.json();
        return { success: true, detail: result };
    }

    const result = await response.json();
    return { success: false, detail: result };

  } catch (error) {
    return { success: false, detail: error, message: 'catch error' }
  }
};

export const filterUsersByUsernameAndCompleteName = async (query: string): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.USER.GET.FILTER_BY_USERNAME_AND_NAME}${query}/`;
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };

    const response = await fetch(url, params);

    if (response.ok) {
      const result = await response.json();
      return { success: true, detail: result };
    }

    const result = await response.json();
    return { success: false, detail: result };

  } catch (error) {
    return { success: false, detail: error, message: 'catch error' }
  }
}

export const getMultipleUsers = async (data: number[]) => {
  try {
    const url = `${VAR.BACKEND_URL}${VAR.API.USER.POST.GET_MULTIPLE_USERS}`;
    const params = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({data: data}),
    };

    const response = await fetch(url, params);

    if (response.ok) {
      const result = await response.json();
      return { success: true, detail: result };
    }

    const result = await response.json();
    return { success: false, detail: result };

  } catch (error) {
    return { success: false, detail: error, message: 'catch error' }
  }
}

export const uploadUserAvatar = async (file: File, user_id: number) => {

  const formData = new FormData();
  formData.append("avatar", file, "profile-image.jpeg");

  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.USER.POST.UPLOAD_USER_AVATAR}${user_id}/`;
    const params = {
      method: 'PUT',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    };

    const response = await fetch(url, params);

    if (response.ok) {
      const result = await response.json();
      return { success: true, detail: result };
    }

    const result = await response.json();
    return { success: false, detail: result };

  } catch (error) {
    return { success: false, detail: error, message: 'catch error' };
  }
}

export const deleteUser = async (id: number): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.USER.DELETE}${id}/`;
    const params = {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };

    const response = await fetch(url, params);

    if (response.ok) {
      const result = await response.json();
      return { success: true, detail: result };
    }

    const result = await response.json();
    return { success: false, detail: result };

  } catch (error) {
    return { success: false, detail: error, message: 'catch error' };
  }
}
