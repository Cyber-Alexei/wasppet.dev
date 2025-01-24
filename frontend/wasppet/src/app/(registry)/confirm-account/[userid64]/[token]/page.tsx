"use client";
import Button from "@mui/material/Button";
import { NextPage } from "next";
import { userConfirmation } from "@/controllers/registration";
import { useEffect, useState } from "react";
import { VAR } from '@/utils/variables';
import { confirm_account_UrlParams } from '@/interfaces/general_use_interfaces';


const ConfirmAccount: NextPage<{ params: confirm_account_UrlParams }> = ({ params }) => {
  const { userid64, token } = params;

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (typeof userid64 === "string" && typeof token === "string") {
        const controllerResult = await userConfirmation({ userid64, token });
        setResult(controllerResult);
      }
    })();
  }, []);

  if (result === null) {
    return (
      '...Loading'
    )
  }


  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-white p-[10px]">
        <h1 className="text-sm text-center pb-3">
          {result.success === false
          ? "It seems like your authentication token doesn't work, please contact us!"
          : "Your account has been confirmed, thanks!"
          }
        </h1>
        <Button
          variant="contained"
          sx={{
            width: '100%',
            backgroundColor: '#ffbf00',
            fontWeight: '600'
          }}
          href={
            result.success === false
            ? `mailto:${VAR.CONTACT_EMAIL}?subject=Authentication%20error&body=Request%20solution%20-%20write%20your%20account%20email:`
            : "/log-in"
          }
        >
          {result.success === true
          ? "Go to the login page"
          : "SEND EMAIL"}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmAccount;
