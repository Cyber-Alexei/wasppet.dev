import { VAR } from "@/utils/variables";
import { userAuthInterface } from "@/interfaces/general_use_interfaces";
import { TabsComponent } from "@/components/account/tabs/tabs";
import { formatDate, formatDateTime } from "@/utils/functions/formatting";
import { UploadUserAvatar } from "@/components/upload_user_avatar/upload_user_avatar";
import { SetStateAction } from "react";

// Component -------------------------------------

export const AccountComponent = ({
  user,
  setUserAuth,
  darkModeEnabled,
  accountOwner,
}: {
  user: userAuthInterface;
  setUserAuth?: (stateAction: SetStateAction<userAuthInterface | null>) => void;
  darkModeEnabled: boolean;
  accountOwner: boolean;
}): JSX.Element => {

  // Tailwind ----------------------------------

  const statisticDiv = "flex gap-3";
  const statisticData = `font-semibold text-primary-background ${
    darkModeEnabled ? "text-primary-font-color" : "text-primary-background"
  }`;
  const statisticLabel = "text-custom-light-gray-2";

  // JSX ---------------------------------------

  return (
    <div className="h-[100%] w-full pt-6">
      {/*Image and principal data*/}
      <div className="flex items-center h-auto">
        <div
          className="relative w-[150px] h-[150px] bg-cover bg-center rounded-md mb-2"
          style={{ backgroundImage: `url(${VAR.BACKEND_URL + user.avatar})` }}
        >
          <div className="absolute ml-2 w-full bottom-2">
            <UploadUserAvatar user_id={user.id} />
          </div>
        </div>
        <div className="h-full w-full flex flex-col justify-center px-6">
          <h2
            className={`text-2xl font-bold ${
              darkModeEnabled
                ? "text-primary-font-color"
                : "text-primary-background"
            }`}
          >
            {user?.complete_name || "Update your name!"}
          </h2>
          <h2
            className={`text-xl font-semibold text-primary-background ${
              darkModeEnabled
                ? "text-primary-font-color"
                : "text-primary-background"
            }`}
          >
            {user?.job_position || "Update your job position!"}
          </h2>
          <p className="font-semibold text-primary-color pt-2">
            {user?.username}
          </p>
        </div>
      </div>
      {/*Statistics*/}
      <div className="flex flex-wrap gap-8 py-3 px-4 border-t border-t-custom-light-gray">
        {/* */}
        {user?.date_joined ? (
          <div className={statisticDiv}>
            <p className={statisticData}>{formatDate(user.date_joined)}</p>
            <p className={statisticLabel}>Join date</p>
          </div>
        ) : null}
        {/* */}
        {user?.last_login ? (
          <div className={statisticDiv}>
            <p className={statisticData}>{formatDate(user.last_login)}</p>
            <p className={statisticLabel}>Last login</p>
          </div>
        ) : null}
        {/* */}
        {user?.birthday_date ? (
          <div className={statisticDiv}>
            <p className={statisticData}>
              {formatDateTime(user.birthday_date)}
            </p>
            <p className={statisticLabel}>Birthday</p>
          </div>
        ) : null}
        {/* */}
        {
          <div className={statisticDiv}>
            <p className={statisticData}>
              {String(user?.post_set.length) || "0"}
            </p>
            <p className={statisticLabel}>Posts count</p>
          </div>
        }
        {/* */}
        {
          <div className={statisticDiv}>
            <p className={statisticData}>
              {String(user?.posts_ups_count) || "0"}
            </p>
            <p className={statisticLabel}>Total ups in posts</p>
          </div>
        }
        {/* */}
        {
          <div className={statisticDiv}>
            <p className={statisticData}>
              {String(user?.snippet_set.length) || "0"}
            </p>
            <p className={statisticLabel}>Total snippets</p>
          </div>
        }
      </div>
      {/*Tabs*/}
      <div className="bg-gray-200 w-full border-t border-t-custom-light-gray">
        <TabsComponent
          user={user}
          setUserAuth={setUserAuth}
          accountOwner={accountOwner}
        />
      </div>
    </div>
  );
};
