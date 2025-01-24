import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState, SetStateAction } from "react";
import { useMainContext } from "@/hooks/main_context";
import { userAuthInterface } from "@/interfaces/general_use_interfaces";
import { AboutMe } from "@/components/account/tabs/about_me/about_me";
import { Security } from "@/components/account/tabs/security/security";
import { UpdateUser } from "@/components/account/tabs/update_user/update_user";
import { Posts } from "@/components/account/tabs/posts/posts";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export const TabsComponent = ({
  user,
  setUserAuth,
  accountOwner,
}: {
  user: userAuthInterface;
  setUserAuth:
    | ((stateAction: SetStateAction<userAuthInterface | null>) => void)
    | undefined;
  accountOwner: boolean;
}): JSX.Element => {
  // Context ---------------------------------

  const { darkModeEnabled } = useMainContext();

  // State -----------------------------------

  const [value, setValue] = useState<number>(0);

  // Handle events -----------------------------

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: `${
          darkModeEnabled
            ? "var(--primary-background)"
            : "var(--secondary-background)"
        }`,
      }}
    >
      <Box
        sx={{
          paddingBottom: "16px",
          borderBottom: 0,
          borderColor: `${
            darkModeEnabled ? "#000000" : "var(--custom-light-gray)"
          }`,
        }}
      >
        <div className="overflow-x-auto">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="account tabs"
            sx={{
              width: "500px",
              padding: "0px 0px 15px 0px",
              display: "flex",
              flexWrap: "nowrap",
              "& .MuiTabs-indicator": {
                backgroundColor: "var(--primary-color)", // Indicator color
              },
            }}
          >
            <Tab
              label="About me"
              sx={{
                color: `${
                  darkModeEnabled ? "#ffffff" : "var(--custom-light-gray-2)"
                }`,
                "&.Mui-selected": {
                  color: "var(--primary-color)", // Active text color
                },
              }}
            />
            <Tab
              label="Posts"
              sx={{
                color: `${
                  darkModeEnabled ? "#ffffff" : "var(--custom-light-gray-2)"
                }`,
                "&.Mui-selected": {
                  color: "var(--primary-color)", // Active text color
                },
              }}
            />
            {accountOwner === true && (
              <Tab
                label="Update user data"
                sx={{
                  color: `${
                    darkModeEnabled ? "#ffffff" : "var(--custom-light-gray-2)"
                  }`,
                  "&.Mui-selected": {
                    color: "var(--primary-color)", // Active text color
                  },
                }}
              />
            )}
            {accountOwner === true && (
              <Tab
              label="Security"
              sx={{
                color: `${
                  darkModeEnabled ? "#ffffff" : "var(--custom-light-gray-2)"
                }`,
                "&.Mui-selected": {
                  color: "var(--primary-color)", // Active text color
                },
              }}
            />
            )}
          </Tabs>
        </div>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AboutMe darkModeEnabled={darkModeEnabled} user={user} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Posts user={user} accountOwner={accountOwner} />
      </CustomTabPanel>
      {accountOwner === true && (
        <CustomTabPanel value={value} index={2}>
          <UpdateUser user={user} setUserAuth={setUserAuth} />
        </CustomTabPanel>
      )}
      {accountOwner === true && (
        <CustomTabPanel value={value} index={3}>
          <Security />
        </CustomTabPanel>
      )}
    </Box>
  );
};
