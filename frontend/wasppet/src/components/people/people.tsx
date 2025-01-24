import { VAR } from "@/utils/variables";
import { userAuthInterface } from "@/interfaces/general_use_interfaces";
import { Search_bar } from "@/components/header/header-components/search_bar/search_bar";
import { useMainContext } from "@/hooks/main_context";
import { filterUsersByUsernameAndCompleteName } from "@/controllers/user";
import Groups2Icon from "@mui/icons-material/Groups2";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const PeopleComponent = (): JSX.Element => {
  // Router ---------------------

  const router = useRouter();

  // Context --------------------

  const { darkModeEnabled } = useMainContext();

  // State ----------------------

  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [people, setPeople] = useState<userAuthInterface[] | null>(null);
  const [notFound, setNotFound] = useState<string | null>(null);

  // useEffect -----------------

  useEffect(() => {
    (async () => {
      if (searchBarValue.length < 2) {
        setPeople(null);
        setNotFound(null);
        return;
      }
      const controllerResponse =
        await filterUsersByUsernameAndCompleteName(searchBarValue);
      console.log(controllerResponse, "CR PEOPLE");
      if (controllerResponse.success === true) {
        setNotFound(null);
        setPeople(controllerResponse.detail);
      } else {
        setPeople(null);
        setNotFound(controllerResponse.detail.Detail);
      }
    })();
  }, [searchBarValue]);

  // JSX ------------------------

  return (
    <div className="w-full ">
      <div className="pt-4 flex items-center justify-center">
        <Search_bar
          placeholder="Look for people"
          value={searchBarValue}
          setValue={setSearchBarValue}
        />
      </div>
      <div className="my-[40px]">
        {(searchBarValue === "" || notFound) && (
          <div
            className={`min-h-[300px] p-4 flex flex-col items-center justify-center gap-4 font-medium ${
              darkModeEnabled
                ? "bg-fourth-background text-primary-font-color"
                : "bg-gray-100 text-primary-background"
            }`}
          >
            {notFound ? (
              <ErrorOutlineIcon sx={{ fontSize: "120px" }} />
            ) : (
              <Groups2Icon sx={{ fontSize: "120px" }} />
            )}
            <p>
              {notFound
                ? notFound
                : "Find people and see what they have posted on wasppet.dev"}
            </p>
          </div>
        )}
        {people &&
          people.map((user) => {
            return (
              <div
                key={user.id}
                className={`flex flex-col gap-4 transition-all duration-300 p-4 rounded-sm cursor-pointer ${
                  darkModeEnabled
                    ? "bg-fourth-background hover:bg-transparent text-primary-font-color"
                    : "bg-gray-100 hover:bg-transparent text-primary-background"
                }`}
                onClick={() => router.push(`/people/${user.username}`)}
              >
                <div className="grid grid-flow-col items-center justify-start gap-4 h-[60px]">
                  <div
                    className="rounded-[100%] h-[60px] bg-cover bg-center w-[60px]"
                    style={{
                      backgroundImage: `url(${VAR.BACKEND_URL + user.avatar})`,
                    }}
                  ></div>
                  <div>
                    <p>{user.complete_name}</p>
                    <p className="text-primary-color">{user.username}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-wrap gap-2">
                    <label className="font-medium text-custom-light-gray-2">
                      Posts count:
                    </label>
                    <p>{String(user.post_set.length) || "0"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label className="font-medium text-custom-light-gray-2">
                      Job position:
                    </label>
                    <p>{user.job_position}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
