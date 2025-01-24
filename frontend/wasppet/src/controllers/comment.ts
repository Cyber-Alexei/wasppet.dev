import { VAR } from "@/utils/variables";

export const publishNewComment = async (data: {
  user: number;
  post: number;
  content: string;
  updated_at: Date;
}): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.COMMENT.POST}`;
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

export const publishNewReply = async (data: {
  user: number;
  parent_comment_id: number;
  post: number;
  content: string;
  updated_at: Date;
}): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.COMMENT.POST}`;
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

export const editComment = async (data: {id: number, content: string}): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.COMMENT.PUT}${data.id}/`;
    const params = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({content: data.content}),
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

export const getAllPostComments = async (post_id: number): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.COMMENT.GET.POST_COMMENT}${post_id}/`;
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

export const getMultipleComments = async (data: {ids: number[]}): Promise<any> => {
  try {
    const url = `${VAR.BACKEND_URL}${VAR.API.COMMENT.GET_MULTIPLE_COMMENTS}`;
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
    return { success: false, detail: error, message: 'catch error' }
  }
}

export const deleteComment = async (data: {id:number, ownerUserId: number, postId: number, responses: number[]}): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.COMMENT.DELETE}${data.id}/`;
    const params = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, params);

    if (response.status === 204) {
      return { success: true };
    }

    const result = await response.json();
    return { success: false, detail: result };

  } catch (error) {
    console.log(error, "THE ERRORRRRRR")
    return { success: false, detail: error, message: 'catch error' };
  }
}

export const upAndDownVotesComment = async (data: {user_id: number, comment_id: number, action: string}): Promise<any> => {
  if (!data.user_id || !data.comment_id || !data.action) return;
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.COMMENT.HANDLE_VOTES}`;
    const params = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
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
    return { success: false, detail: error, message: 'catch error' };
  }
}
