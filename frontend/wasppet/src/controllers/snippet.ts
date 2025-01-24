import { VAR } from "@/utils/variables";
import { newSnippetForm } from "@/interfaces/general_use_interfaces";

export const createNewSnippet = async (data: newSnippetForm): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.SNIPPET.POST}`;
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

export const getSingleSnippet = async (data: {id: number}) => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.SNIPPET.GET.SINGLE_SNIPPET}${data.id}/`;
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
      return { success: true, detail: result }
    }

    const result = await response.json();
    return { success: false, detail: result }

  } catch (error) {
    return { success: false, detail: error, message: 'catch error'}
  }
}

export const getAllUserSnippets = async (data: {
  user_id: number;
  paginationPage: number;
  query?: string;
}) => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    let url;
    if (data.query?.length) {
      url = `${VAR.BACKEND_URL}${VAR.API.SNIPPET.GET.ALL_USER_SNIPPETS}${data.user_id}/?page=${data.paginationPage}&query=${data.query}`;
    } else {
      url = `${VAR.BACKEND_URL}${VAR.API.SNIPPET.GET.ALL_USER_SNIPPETS}${data.user_id}/?page=${data.paginationPage}`;
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

export const deleteSnippet = async (id: number): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.SNIPPET.DELETE}${id}/`;
    const params = {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, params);

    if (response.status === 204) {
      return { success: true, detail: "Snippet deleted" };
    }

    const result = await response.json();
    return { success: false, detail: result };
  } catch (error) {
    return { success: false, detail: error, message: "catch error" };
  }
};

export const updateSnippet = async (data: newSnippetForm): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.SNIPPET.PUT}${data.id}/`;
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

export const getMultipleSnippets = async (snippetIds: number[]): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.SNIPPET.GET.GET_MULTIPLE_SNIPPETS}`;
    const params = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({snippetIds: snippetIds})
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
