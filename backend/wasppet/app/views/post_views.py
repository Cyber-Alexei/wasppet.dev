from datetime import timedelta
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from app.serializers import PostSerializer
from rest_framework.generics import get_object_or_404
from app.models import Post, Skill, Snippet, User
from django.db.models import Q


class PostView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Get an object / instance
    def get_object(self, id):
        try:
            return Post.objects.get(id=id)
        except Post.DoesNotExist:
            return None

    # Get all posts from last week
    def get_all_last_two_months(self, request):
        current_date_minus_two_months = timezone.now() - timedelta(weeks=8)

        #posts = Post.objects.filter(
        #    created_at__gte=current_date_minus_two_months
        #).order_by("-created_at")

        posts = Post.objects.all().order_by("-created_at")

        if posts.exists():
            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"Detail": "No Posts Found"}, status=status.HTTP_404_NOT_FOUND)

    # -----------------------------------

    # Get post or posts
    def get(self, request, id=None, user_id=None, query=None, format=None):
        if id:
            post = self.get_object(id)
            if post is None:
                return Response(
                    {"Detail": "Not Post Found"}, status=status.HTTP_404_NOT_FOUND
                )
            serializer = PostSerializer(post)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif user_id:
            try:
                userId = User.objects.get(id__exact=user_id).to_dict()["id"]
                if userId is None:
                    return Response(
                        {"Detail": "Not user found"}, status=status.HTTP_400_BAD_REQUEST
                    )
                posts = Post.objects.filter(user__exact=userId).order_by("-created_at")
                if not posts.exists():
                    return Response(
                        {"Detail": "Not Posts Found"}, status=status.HTTP_404_NOT_FOUND
                    )
                serializer = PostSerializer(posts, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(
                    {"Detail": "Not user found"}, status=status.HTTP_400_BAD_REQUEST
                )
        elif query:
            posts = Post.objects.filter(
                Q(title__icontains=query)
                | Q(languages_names__contains=[query])
                | Q(technologies_names__contains=[query])
            ).order_by("-created_at")
            if not posts.exists():
                return Response(
                    {"Detail": "Not Posts Found"}, status=status.HTTP_404_NOT_FOUND
                )
            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return self.get_all_last_two_months(request)

    # Create post
    def post(self, request, format=None):
        # Change IDs for PKs
        languages = request.data["languages"]
        request.data["languages"] = Skill.objects.filter(id__in=languages).values_list(
            "pk", flat=True
        )
        snippets = request.data["snippets"]
        request.data["snippets"] = Snippet.objects.filter(id__in=snippets).values_list(
            "pk", flat=True
        )
        technologies = request.data["technologies"]
        request.data["technologies"] = Skill.objects.filter(
            id__in=technologies
        ).values_list("pk", flat=True)
        # Serialize the data
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Update post
    def put(self, request, id, format=None):
        post = self.get_object(id)
        if post is None:
            return Response({"Detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete post
    def delete(self, request, id, format=None):
        upsToRestore = request.data["upsToRestore"]
        user = User.objects.get(id__exact=request.data["user"])
        post = self.get_object(id)
        if post is None:
            return Response({"Detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        post.delete()
        user.posts_ups_count += upsToRestore
        user.save()
        return Response({"Detail": "Post Deleted"}, status=status.HTTP_200_OK)


class UpAndDownVotesPost(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):

        # Data
        user_who_vote_id = request.data["user_id"]
        post_id = request.data["post_id"]
        action = request.data["action"]

        post = get_object_or_404(Post, id__exact=post_id)
        user_who_vote = get_object_or_404(User, id__exact=user_who_vote_id)
        user_post_owner = get_object_or_404(User, id__exact=post.user.id)

        # Logic
        if action == "up":
            # User who vote is already in up list, so delete from it and return
            if post.users_who_vote_up.filter(id=user_who_vote_id).exists():
                post.users_who_vote_up.remove(user_who_vote)
                user_post_owner.posts_ups_count -= 1
                post.save()
                user_post_owner.save()
                return Response(
                    {"Detail": "User who vote quit up vote"}, status=status.HTTP_200_OK
                )
            # User is in the opposite list so delete from it
            if post.users_who_vote_down.filter(id=user_who_vote_id).exists():
                post.users_who_vote_down.remove(user_who_vote)
                user_post_owner.posts_ups_count += 1
            # Set user in up list
            post.users_who_vote_up.add(user_who_vote)
            user_post_owner.posts_ups_count += 1
            post.save()
            user_post_owner.save()
            return Response({"Detail": "User is in up votes"}, status=status.HTTP_200_OK)

        elif action == "down":
            # User who vote is already in down list, so delete from it and return
            if post.users_who_vote_down.filter(id=user_who_vote_id).exists():
                post.users_who_vote_down.remove(user_who_vote)
                user_post_owner.posts_ups_count += 1
                post.save()
                user_post_owner.save()
                return Response(
                    {"Detail": "User who vote quit down vote"}, status=status.HTTP_200_OK
                )
            # User is in the opposite list so delete from it
            if post.users_who_vote_up.filter(id=user_who_vote_id).exists():
                post.users_who_vote_up.remove(user_who_vote)
                user_post_owner.posts_ups_count -= 1
            # Set user in down list
            post.users_who_vote_down.add(user_who_vote)
            user_post_owner.posts_ups_count -= 1
            post.save()
            user_post_owner.save()
            return Response(
                {"Detail": "User is in down votes"}, status=status.HTTP_200_OK
            )
        return Response(
            {"Detail": "No valid data sent"}, status=status.HTTP_400_BAD_REQUEST
        )
