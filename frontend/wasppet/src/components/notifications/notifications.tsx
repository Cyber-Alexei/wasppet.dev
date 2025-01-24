import { VAR } from "@/utils/variables";
import { useRouter } from "next/navigation";
import {
  getAllUserNotifications,
  markNotificationAsViewed,
  deleteNotification,
} from "@/controllers/notification";
import { getMultipleUsers } from "@/controllers/user";
import NotificationsPausedIcon from "@mui/icons-material/NotificationsPaused";
import {
  notification,
  userAuthInterface,
} from "@/interfaces/general_use_interfaces";
import { useUserAuthContext } from "@/hooks/user_auth_context";
import { useMainContext } from "@/hooks/main_context";
import { usePostContext } from "@/hooks/post_context";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useState } from "react";

export const NotificationsComponent = ({
  userid,
}: {
  userid: number;
}): JSX.Element => {
  // Router -----------------------

  const router = useRouter();

  // Context ----------------------

  const { reloadUserAuthData } = useUserAuthContext();
  const { darkModeEnabled } = useMainContext();
  const { showComments, setShowComments } = usePostContext();

  // State ------------------------

  const [notifications, setNotifications] = useState<
    notification[] | null | undefined
  >(undefined);
  const [notificationsUsers, setNotificationsUsers] = useState<
    userAuthInterface[] | null
  >(null);
  const [clickedNotification, setClickedNotification] =
    useState<notification | null>(null);
  const [reloadNotifications, setReloadNotifications] = useState<number>(0);

  // Handle events ----------------

  const onClickNotification = async (notification: notification) => {
    const controllerResponse = await markNotificationAsViewed({
      notificationId: notification.id,
    });
    if (controllerResponse.success === true) {
      setShowComments(true);
      setClickedNotification(notification);
    }
  };

  const onDeleteNotification = async (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    e.stopPropagation();
    const controllerResponse = await deleteNotification(id);
    if (controllerResponse.success === true) {
      setReloadNotifications(prevState => prevState + 1);
    }
  }

  // useEffect --------------------

  useEffect(() => {
    // Get all the user notifications
    (async () => {
      const controllerResponse = await getAllUserNotifications(userid);
      if (controllerResponse.success === true) {
        setNotifications(controllerResponse.detail);
      } else {
        setNotifications(null);
      }
    })();
  }, [reloadUserAuthData, reloadNotifications]);

  useEffect(() => {
    // Get all users who made the notifications actions
    if (!notifications) return;
    (async () => {
      const notificationsUsersArray = [];
      for (let i = 0; i < notifications.length; i++) {
        notificationsUsersArray.push(notifications[i].from_user);
      }
      const controllerResponse = await getMultipleUsers(
        notificationsUsersArray
      );
      if (controllerResponse.success === true) {
        setNotificationsUsers(controllerResponse.detail);
      } else {
        setNotificationsUsers(null);
      }
    })();
  }, [notifications]);

  useEffect(() => {
    if (showComments && clickedNotification) {
      router.push(clickedNotification.url);
    }
  }, [showComments, clickedNotification]);

  // JSX --------------------------

  return (
    <div className="flex flex-col gap-4 min-h-[calc(100vh-60px)] w-full py-10">
      {notifications === null && (
        <div className="flex items-center justify-center h-[100%] w-[100%]">
          <div
            className={`flex flex-col gap-4 items-center justify-center min-h-[300px] w-full ${
              darkModeEnabled
                ? "bg-fourth-background text-primary-font-color"
                : "bg-gray-100 text-primary-background"
            }`}
          >
            <NotificationsPausedIcon sx={{ fontSize: "120px" }} />
            <p>It seems like you don't have any notification</p>
          </div>
        </div>
      )}
      {notifications &&
        notifications.map((notification) => {
          const notificationUser = notificationsUsers?.find((user) => {
            return user.id === notification.from_user;
          });
          if (!notificationUser) return;
          return (
            <div
              id={String(notification.id)}
              className={`relative grid grid-flow-col items-center justify-start cursor-pointer rounded-sm p-4 gap-4 transition-all duration-300 ${
                darkModeEnabled
                  ? "bg-fourth-background hover:bg-transparent text-primary-font-color"
                  : "bg-gray-100 hover:bg-transparent text-primary-background"
              }`}
              key={notification.id}
              onClick={() => onClickNotification(notification)}
            >
              <div
                className="rounded-[100%] bg-cover bg-center h-[60px] w-[60px]"
                style={{backgroundImage: `url(${VAR.BACKEND_URL}${notificationUser?.avatar})`}}
              >
              </div>
              <p>{`${notificationUser.username}${" "}${
                notification.message
              }`}
              </p>
              <div 
                className="absolute p-5 deleteIcon top-3 right-4 hover:text-primary-color"
                onClick={(e) => onDeleteNotification(e, notification.id)}
              >
                <DeleteOutlineIcon className="deleteIcon" />
              </div>
            </div>
          );
        })}
    </div>
  );
};
