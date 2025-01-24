import { VAR } from "@/utils/variables";

// Controller to get all Skills (languages and technologies)
export const getAllSkills = async (): Promise<any> => {
  try {
    const token = localStorage.getItem("wasppet.dev_user-token");
    const url = `${VAR.BACKEND_URL}${VAR.API.SKILL.GET.ALL_SKILLS}`;
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
