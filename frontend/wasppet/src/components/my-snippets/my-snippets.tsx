import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useMainContext } from "@/hooks/main_context";
import { useState } from "react";
import { NewSnippet } from "@/components/my-snippets/new_snippet/new_snippet";
import { MySnippets } from "@/components/my-snippets/my_snippets/my_snippets";
import { Search_bar } from "@/components/header/header-components/search_bar/search_bar";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}>
      {value === index && <Box className="">{children}</Box>}
    </div>
  );
}

export const MySnippetsComponent = (): JSX.Element => {
  // Context ---------------------------------------

  const { darkModeEnabled } = useMainContext();

  // State -----------------------------------------

  const [value, setValue] = useState<number>(0);
  const [searchBarValue, setSearchBarValue] = useState<string>('')

  // Handle events -----------------------------

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // JSX -------------------------------------------

  return (
    <div className="relative pt-6 flex flex-col items-center h-full w-full">
      <div className={`flex items-center justify-center w-[100%] min-w-[300px] h-auto min-h-[80px] text-center px-4 py-6 rounded-sm ${
              darkModeEnabled
                ? "text-primary-font-color bg-fourth-background"
                : "text-primary-background bg-gray-100"
            }`}>
        {value === 0 && (
          <p>
            You can save snippets selecting many technologies but just one
            language, then attach several snippets in one post to explain a
            solution.
          </p>
        )}
        {value === 1 && (
          <Search_bar placeholder="Look for a title" value={searchBarValue} setValue={setSearchBarValue} />
        )}
      </div>

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
            marginBottom: "16px",
            borderBottom: 1,
            borderColor: `${
              darkModeEnabled ? "#000000" : "var(--custom-light-gray)"
            }`,
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="account tabs"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "var(--primary-color)", // Color del indicador
              },
            }}
          >
            <Tab
              label="New snippet"
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
              label="My snippets"
              sx={{
                color: `${
                  darkModeEnabled ? "#ffffff" : "var(--custom-light-gray-2)"
                }`,
                "&.Mui-selected": {
                  color: "var(--primary-color)", // Active text color
                },
              }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <NewSnippet />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <MySnippets changeTab={setValue} searchBarValue={searchBarValue} />
        </CustomTabPanel>
      </Box>
    </div>
  );
};
