import { VAR } from "@/utils/variables";
import {signup_FormData, confirm_account_UrlParams} from '@/interfaces/general_use_interfaces';

export const userRegistration = async (data: signup_FormData): Promise<any> => {
  try {
    const url = `${VAR.BACKEND_URL}${VAR.API.REGISTRATION.REGISTER}`;
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
    return { success: false, detail: error, message: 'catch error' };
  }
};



export const userConfirmation = async (data: confirm_account_UrlParams): Promise<any> => {
  try {
    const url = `${VAR.BACKEND_URL}${VAR.API.REGISTRATION.CONFIRMATION}${data.userid64}/${data.token}/`;
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, params)

    if (response.ok) {
      const result = await response.json()
      return {success: true, detail: result}
    }

    const result = await response.json()
    return {success: false, detail: result};

  } catch (error) {
    return { success: false, detail: error, message: 'catch error'};
  }
};
