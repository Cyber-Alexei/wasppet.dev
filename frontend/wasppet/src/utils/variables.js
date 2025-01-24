import {DateTime} from "luxon";

export const VAR = {
    DateTime: DateTime,
    CONTACT_EMAIL: 'armonicacelta@gmail.com',
    BACKEND_URL: 'http://localhost:8000/',

    API: {
        REGISTRATION: {
            REGISTER: 'api/registration/register/',
            CONFIRMATION: 'api/registration/confirmation/',
                // url params: <str:userid64>/<str:token>/
        },
        USER: {
            GET: {
                SINGLE_USER: 'api/user/get/single-user/',
                    // url params: <int:id>/
                SINGLE_USER_BY_USERNAME: 'api/user/get/single-user-by-username/',
                    // url params: <str:username>/<str:mode>/ (mode:search-by-username)
                USERNAME: 'api/user/get/username/',
                    // url params: <int:username>/
                NAME: 'api/user/get/name/',
                    // url params: <int:complete_name>/
                FRIEND_LIST: 'api/user/get/friends-list/',
                    // url params: <int:friends_of_id>/
                FILTER_BY_USERNAME_AND_NAME: 'api/user/get/username-and-name/',
                    // url params: <str:query>/
            },
            POST: {
                GET_MULTIPLE_USERS: 'api/user/get/multiple-users/',
                UPLOAD_USER_AVATAR: 'api/user/post/upload-user-avatar/',
                    // url params: <str:user_id>/
            },
            PUT: 'api/user/put/',
                // url params: <int:id>/
            DELETE: 'api/user/delete/',
                // url params: <int:id>/
        },
        SNIPPET: {
            GET: {
                SINGLE_SNIPPET: 'api/snippet/get/single-snippet/',
                    // url params: <int:id>/
                ALL_USER_SNIPPETS: 'api/snippet/get/all-user-snippets/',
                    // url params: <int:user_id>/
                GET_MULTIPLE_SNIPPETS: 'api/snippet/get/multiple-snippets/',
            },
            POST: 'api/snippet/post/',
            PUT: 'api/snippet/put/',
                // url params: <int:id>/
            DELETE: 'api/snippet/delete/',
                // url params: <int:id>/
        },
        SKILL: {
            GET: {
                SINGLE_SKILL: 'api/skill/get/single-skill/',
                    // url params: <int:id>/
                ALL_SKILLS: 'api/skill/get/all-skills/',
            },
        },
        POST: {
            GET: {
                SINGLE_POST: 'api/post/get/single-post/',
                    // url params: <int:id>/
                USER_ALL_POSTS: 'api/post/get/all-user-posts/',
                    // url params: <int:user_id>/
                LAST_TWO_MONTHS: 'api/post/get/last-two-months/',
                BY_SEARCH_VALUE: 'api/post/get/by-search-value/',
                    // url params: <str:query>
            },
            POST: 'api/post/post/',
            HANDLE_VOTES: 'api/post/handle-votes/',
            PUT: 'api/post/put/',
                // url params: <int:id>/
            DELETE: 'api/post/delete/',
                // url params: <int:id>/
        },
        COMMENT: {
            GET: {
                SINGLE_COMMENT: 'api/comment/get/single-comment/',
                    // url params: <int:id>/
                POST_COMMENT: 'api/comment/get/post-comments/',
                    // url params: <int:post_id>/
            },
            POST: 'api/comment/post/',
            GET_MULTIPLE_COMMENTS: 'api/comment/get-multiple-comments/',
            HANDLE_VOTES: 'api/comment/handle-votes/',
            PUT: 'api/comment/put/',
                // url params: <int:id>/
            DELETE: 'api/comment/delete/',
                // url params: <int:id>/
        },
        NOTIFICATION: {
            GET: {
                GET_ALL_USER_NOTIFICATIONS: 'api/notification/get/get-all-user-notifications/',
                    // url params: <str:user_id>/
            },
            POST: 'api/notification/post/',
            PUT: {
                MARK_AS_VIEWED: 'api/notification/put/mark-as-viewed/',
            },
            DELETE: 'api/notification/delete/'
                // url params: <int:id>/
        },
        SESSION: {
            LOGIN: 'api/token-auth/login/',
            GETUSER: 'api/token-auth/get-user/',
            CHANGEPASSWORD: 'api/change-password/',
            SENDVERIFYCODE: 'api/send-verification-code-by-email/',
            FORGOTPASSWORD: 'api/forgot-password/',
            RECOVERPASSWORD: 'api/recover-password/',
        }
    }
}