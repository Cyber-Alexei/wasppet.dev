import { VAR } from "@/utils/variables";
import {login_FormData} from '@/interfaces/general_use_interfaces';


// Controller to get a token for the user and store it in localStorage
export const userLogin = async (data: login_FormData): Promise<any> => {
  try {
    const url = `${VAR.BACKEND_URL}${VAR.API.SESSION.LOGIN}`;
    const params = {
      // POST request to send data in the body
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
      // Backend view also return "newly_created", a boolean string value
      // that indicates if the token is newly created or has been recovered
    }

    const result = await response.json();
    return { success: false, detail: result };

  } catch (error) {
    return { success: false, detail: error, message: 'catch error' };
  }
};


export const setUserUsingToken = async (token: {token: string}): Promise<any> => {
  try {
    const url = `${VAR.BACKEND_URL}${VAR.API.SESSION.GETUSER}`;
    const params = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token)
    }

    const response = await fetch(url, params);

    if (response.ok) {
      const result = await response.json()
      return {success: true, detail: result}
    }

    const result = await response.json()
    return {success: false, detail: result}

  } catch (error) {
    return {success: false, detail: error, message: 'catch error'}
  }
}
