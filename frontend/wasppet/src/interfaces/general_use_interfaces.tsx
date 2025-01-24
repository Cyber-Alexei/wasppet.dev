export interface confirm_account_UrlParams {
    userid64: string;
    token: string;
}

  export interface login_FormData {
    email: string;
    password: string;
}

export interface signup_FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
}
  
export interface signup_objectControllerResponse {
    success: boolean;
    detail?: any;
    message?: string;
}

export interface homesidebar_props {
    props: {
        menuDisplayed: boolean;
        onClickDarkMode: () => void;
        darkModeEnabled: boolean;
    }
}

export interface userAuthInterface {
    id: number;
    avatar: string|null;
    birthday_date: string;
    complete_name: string|null;
    date_joined: string;
    description: string|null;
    email: string;
    first_name: string;
    friends_list: string[];
    is_active: boolean;
    is_staff: boolean;
    job_position: string|null;
    last_login: string|null;
    last_name: string;
    posts_ups_count: number;
    skills: string;
    username: string;
    post_set: any;
    snippet_set: any;
}

export type userAuthWithoutAvatar = Omit<userAuthInterface, 'avatar'>

export interface changePassword {
    current_password: string;
    new_password: string;
    new_password_confirm?: string;
    id?: string|number;
}

export interface changeEmailInputs {
    newEmail: string;
    code: string|null;
    userVerificationCode: string;
    userPassword: string;
}

export interface forgotPasswordInputs {
    emailInput: string;
    code: string;
    userVerificationCode: string;
    new_password: string;
    new_password_confirm: string;
}


export interface newSnippetFormSelect {
    value: string;
    label: string;
}

export interface newSnippetForm {
    id?: number|null;
    updated_at?: string|null;
    user: number|null; // The user id
    title: string;
    description: string;
    code: string;
    language: newSnippetFormSelect|null;
    language_name?: newSnippetFormSelect|null; // Not necessary to update a snippet, autofill
    technology: newSnippetFormSelect[];
    technology_names?: newSnippetFormSelect[]; // Not necessary to update a snippet, autofill
}

export interface savedSnippetData {
    id: number;
    updated_at: string;
    user: number; // The user id
    title: string;
    description: string;
    code: string;
    language: number|null;
    language_name: newSnippetFormSelect|null;
    technology: number[];
    technology_names: newSnippetFormSelect[];
}

// State to store post engine items data
export interface postEngineItem {
    item: string;
    order: number; 
    value?: string;
    snippet?: any;
}

export interface postEngineItems {
    [key: string]: postEngineItem;
}

export interface itemsSnippetProperty {
    snippetId: number,
    language: number|null,
    language_name: newSnippetFormSelect|null,
    technology: number[],
    technology_names: newSnippetFormSelect[],
}

// Posts

export interface post {
    id?: number;
    title: string;
    user: number;
    snippets: number[];
    share_url: string;
    languages: number[];
    languages_names: string[];
    technologies: number[];
    technologies_names: string[];
    post: postEngineItems;
    users_who_comment?: number[];
    created_at?: string;
    updated_at?: string | Date;
    users_who_vote_up?: number[];
    users_who_vote_down?: number[];
}

export interface comment {
    id: number;
    user: number;
    post: number;
    responses: number[];
    content: string;
    users_who_vote_up: number[];
    users_who_vote_down: number[];
    created_at: string;
    updated_at: string;
}

export interface notification {
    id: number;
    from_user: number;
    to_user: number;
    message: string;
    url: string;
}