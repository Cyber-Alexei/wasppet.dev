import { userAuthInterface } from '@/interfaces/general_use_interfaces';


export const AboutMe = ({darkModeEnabled, user}: {darkModeEnabled: boolean, user:userAuthInterface | null}): JSX.Element => {

    return (
        <div className="flex flex-col gap-6">
          <div
            className={`flex items-center rounded-sm min-h-[60px] py-3 px-2 ${
              darkModeEnabled ? "bg-fourth-background text-primary-font-color" : "bg-gray-100 text-primary-background"
            }`}
          >
            {user?.description || "Update a description of you!"}
          </div>
          <div
            className={`flex flex-wrap gap-6 items-center rounded-sm min-h-[60px] py-3 px-2 text-primary-font-color ${
              darkModeEnabled ? "bg-fourth-background" : "bg-gray-100"
            }`}
          >
            {user && user.skills.length > 1 &&
                user.skills.split(',').map((item, index) => (
                    <div key={index} className="px-4 py-1 bg-primary-color text-semibold rounded-2xl">{item}</div>
                ))
            }

            {user?.skills.length === 0 && (
                <p className={`${darkModeEnabled ? 'text-primary-font-color':'text-primary-background'}`}>Update your skills!</p>
            )}
          </div>
        </div>
    )
}