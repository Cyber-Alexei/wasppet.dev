from app.views.comment_views import (
    CommentView,
    UpAndDownVotesComment,
    GetMultipleComments,
)
from app.views.post_views import PostView, UpAndDownVotesPost
from app.views.skill_views import SkillView
from app.views.snippet_views import SnippetView, SnippetView2
from app.views.user_views import UserView, UserView2, UploadUserAvatar
from app.views.notification_views import NotificationView
from app.views.registration_views import RegistrationView, ConfirmAccountView
from app.views.session_views import (
    LoginView,
    GetUserWithTokenView,
    ChangePassword,
    SendVerificationCode,
    forgotPasswordVerificationCode,
    recoverPassword,
)
from django.urls import path


urlpatterns = [
    # Comment endpoints ------------------------------------------
    # GET
    path(
        "comment/get/single-comment/<int:id>/",
        CommentView.as_view(),
        name="get-single-comment",
    ),
    path(
        "comment/get/post-comments/<int:post_id>/",
        CommentView.as_view(),
        name="get-all-post-comments",
    ),
    # POST
    path("comment/post/", CommentView.as_view(), name="post-comment"),
    path(
        "comment/handle-votes/",
        UpAndDownVotesComment.as_view(),
        name="up-down-votes-comment",
    ),
    path(
        "comment/get-multiple-comments/",
        GetMultipleComments.as_view(),
        name="get-multiple-comments",
    ),
    # PUT
    path("comment/put/<int:id>/", CommentView.as_view(), name="put-comment"),
    # DELETE
    path("comment/delete/<int:id>/", CommentView.as_view(), name="delete-comment"),
    # Post endpoints ---------------------------------------------
    # GET
    path("post/get/single-post/<int:id>/", PostView.as_view(), name="get-single-post"),
    path("post/get/last-two-months/", PostView.as_view(), name="get-last-week-posts"),
    path(
        "post/get/by-search-value/<str:query>/",
        PostView.as_view(),
        name="get-posts-by-query",
    ),
    path(
        "post/get/all-user-posts/<int:user_id>/",
        PostView.as_view(),
        name="get-all-user-posts",
    ),
    # POST
    path("post/post/", PostView.as_view(), name="post-post"),
    path("post/handle-votes/", UpAndDownVotesPost.as_view(), name="up-down-votes-post"),
    # PUT
    path("post/put/<int:id>/", PostView.as_view(), name="put-post"),
    # DELETE
    path("post/delete/<int:id>/", PostView.as_view(), name="delete-post"),
    # Skill endpoints --------------------------------------------
    # GET
    path("skill/get/single-skill/<int:id>/", SkillView.as_view(), name="skill-detail"),
    path("skill/get/all-skills/", SkillView.as_view(), name="get-all-skills"),
    # Snippet endpoints ------------------------------------------
    # GET
    path(
        "snippet/get/single-snippet/<int:id>/",
        SnippetView.as_view(),
        name="get-single-snippet",
    ),
    path(
        "snippet/get/all-user-snippets/<int:user_id>/",
        SnippetView.as_view(),
        name="get-all-user-snippets",
    ),
    path("snippet/get/multiple-snippets/", SnippetView2.as_view(), name="get-multiple-snippets"),
    # POST
    path("snippet/post/", SnippetView.as_view(), name="post-snippet"),
    # PUT
    path("snippet/put/<int:id>/", SnippetView.as_view(), name="put-snippet"),
    # DELETE
    path("snippet/delete/<int:id>/", SnippetView.as_view(), name="delete-snippet"),
    # User endpoints ----------------------------------------------
    # GET
    path("user/get/single-user/<int:id>/", UserView.as_view(), name="get-single-user"),
    path(
        "user/get/single-user-by-username/<str:username>/<str:mode>/",
        UserView.as_view(),
        name="get-single-user-by-username",
    ),
    path(
        "user/get/username-and-name/<str:query>/",
        UserView.as_view(),
        name="filter-by-username-and-name",
    ),
    path(
        "user/get/username/<int:username>/", UserView.as_view(), name="filter-by-username"
    ),
    path("user/get/name/<int:complete_name>/", UserView.as_view(), name="filter-by-name"),
    # GET friends list of a user by ID
    path(
        "user/get/friends-list/<int:friends_of_id>/",
        UserView.as_view(),
        name="get-friends-list",
    ),
    # POST
    path(
        "user/get/multiple-users/",
        UserView2.as_view(),
        name="get-multiple-users",
    ),
    path("user/post/upload-user-avatar/<str:user_id>/", UploadUserAvatar.as_view(), name="upload-user-avatar"),
    # PUT
    path("user/put/<int:id>/", UserView.as_view(), name="put-user"),
    # DELETE
    path("user/delete/<int:id>/", UserView.as_view(), name="delete-user"),
    # Notification endpoints ---------------------------------------
    # GET
    path(
        "notification/get/get-all-user-notifications/<str:user_id>/",
        NotificationView.as_view(),
        name="get-all-user-notifications",
    ),
    # POST
    path("notification/post/", NotificationView.as_view(), name="post-notification"),
    # PUT
    path("notification/put/mark-as-viewed/", NotificationView.as_view(), name="mark-notification-as-viewed"),
    # DELETE
    path("notification/delete/<int:id>/", NotificationView.as_view(), name="delete-notification"),
    # Registration endpoints ---------------------------------------
    # POST
    path("registration/register/", RegistrationView.as_view(), name="register-user"),
    # GET
    path(
        "registration/confirmation/<str:userid64>/<str:token>/",
        ConfirmAccountView.as_view(),
        name="confirm-user",
    ),
    # Session endpoints --------------------------------------------
    # POST
    path("token-auth/login/", LoginView.as_view(), name="login"),
    # POST
    path(
        "token-auth/get-user/", GetUserWithTokenView.as_view(), name="get-user-with-token"
    ),
    # PUT
    path("change-password/", ChangePassword.as_view(), name="change-password"),
    # POST
    path(
        "send-verification-code-by-email/",
        SendVerificationCode.as_view(),
        name="send-verification-code",
    ),
    # POST
    path(
        "forgot-password/",
        forgotPasswordVerificationCode.as_view(),
        name="forgot-password",
    ),
    # POST
    path("recover-password/", recoverPassword.as_view(), name="recover-password"),
]
