import { VAR } from "@/utils/variables";
import { post } from "@/interfaces/general_use_interfaces";


export const createNewPost = async (data: post): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.POST.POST}`;
    const params = {
      method: "POST",
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

export const updatePost = async ({
  dataToSend,
  postInUpdateId,
}: {
  dataToSend: post;
  postInUpdateId: number;
}): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.POST.PUT}${postInUpdateId}/`;
    const params = {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
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

export const getAllUserPosts = async ({
  user_id,
}: {
  user_id: number;
}): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.POST.GET.USER_ALL_POSTS}${user_id}/`;
    let params;
    if (token) {
      params = {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
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
    return { success: false, detail: error, message: "catch error" };
  }
};

export const getFeedPosts = async (data:{searchValue: string}): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    let url;
    if (data.searchValue.length > 1) {
      url = `${VAR.BACKEND_URL}${VAR.API.POST.GET.BY_SEARCH_VALUE}${data.searchValue}/`;
    } else {
      url = `${VAR.BACKEND_URL}${VAR.API.POST.GET.LAST_TWO_MONTHS}`;
    }
    
    const params = {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
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

export const getSinglePost = async ({id}: {id:string}): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.POST.GET.SINGLE_POST}${id}/`;
    let params;
    if (token) {
      params = {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
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
}

export const deletePost = async (data: {id: number, upsToRestore: number, user: number}): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.POST.DELETE}${data.id}/`;
    const params = {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({upsToRestore: data.upsToRestore, user: data.user})
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

export const upAndDownVotesPost = async (data: {user_id: number, post_id: number, action: string}): Promise<any> => {
  if (!data.user_id || !data.post_id || !data.action) return;
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.POST.HANDLE_VOTES}`;
    const params = {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    if (!token) return;

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
