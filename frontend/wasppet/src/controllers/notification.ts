import { VAR } from "@/utils/variables";

export const createNewNotification = async (data: {
  from_user: number;
  to_user: number;
  message: string;
  url: string;
}): Promise<any> => {
    try {
        const token = localStorage.getItem("wasppet.dev_user-token");
        const url = `${VAR.BACKEND_URL}${VAR.API.NOTIFICATION.POST}`;
        const params = {
            method: 'POST',
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
        return { success: false, detail: error, message: 'catch error' }
    }
};

export const getAllUserNotifications = async (user_id: number): Promise<any> => {
    try {
        const token = localStorage.getItem("wasppet.dev_user-token");
        const url = `${VAR.BACKEND_URL}${VAR.API.NOTIFICATION.GET.GET_ALL_USER_NOTIFICATIONS}${user_id}/`;
        const params = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
        };

        const response = await fetch(url, params);

        if (response.ok) {
            const result = await response.json();
            return { success: true, detail: result };
        };

        const result = await response.json();
        return { success: false, detail: result };

    } catch (error) {
        return { success: false, detail: error, message: 'catch error' };
    }
}

export const markNotificationAsViewed = async (data: {notificationId: number}): Promise<any> => {
    try {
        const token = localStorage.getItem("wasppet.dev_user-token");
        const url = `${VAR.BACKEND_URL}${VAR.API.NOTIFICATION.PUT.MARK_AS_VIEWED}`;
        const params = {
            method: 'PUT',
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
        return { success: false, detail: error, message: 'catch error' };
    }
}

export const deleteNotification = async (id: number): Promise<any> => {
    try {
        const token = localStorage.getItem("wasppet.dev_user-token");
        const url = `${VAR.BACKEND_URL}${VAR.API.NOTIFICATION.DELETE}${id}/`;
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
