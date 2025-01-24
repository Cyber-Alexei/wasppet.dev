from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from app.serializers import CommentSerializer
from app.models import Comment, Post, User


class CommentView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Get an object / instance
    def get_object(self, id):
        try:
            return Comment.objects.get(id=id)
        except Comment.DoesNotExist:
            return None 

    # Get all comments in a post using the post id
    def get_all_post_comments(self, id):
        comments = Comment.objects.filter(post=id).order_by('-id')
        if comments.exists():
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"Detail": "No Comments Found"}, status=status.HTTP_404_NOT_FOUND)

    # --------------------------------------------
        
    # Get comment or comments
    def get(self, request, id=None, post_id=None, format=None):
        if id:
            comment = self.get_object(id)
            if comment is None:
                return Response({"Detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = CommentSerializer(comment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        if post_id:
            return self.get_all_post_comments(post_id)
        return Response({"Detail": "Invalid Request"}, status=status.HTTP_400_BAD_REQUEST)

    # Create comment
    def post(self, request, format=None):
        # A comment case
        if not request.data.get('parent_comment_id'):
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                post = Post.objects.get(id=request.data["post"])
                user = User.objects.get(id=request.data["user"])
                if not post.users_who_comment:
                    post.users_who_comment = [user.id]
                    post.save()
                else:
                    post.users_who_comment.append(user.id)
                    post.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # A reply case
        elif request.data.get('parent_comment_id'):
            # Data
            data_to_serialize = {
                'user': request.data["user"],
                'content': request.data["content"],
                'updated_at': request.data["updated_at"],
            }
            parent_comment_id = request.data["parent_comment_id"]
            post = Post.objects.get(id=request.data['post'])
            parent_comment = Comment.objects.get(id__exact=parent_comment_id)
            # Serialization
            serializer = CommentSerializer(data=data_to_serialize)
            if serializer.is_valid() and post and parent_comment:
                # Save the reply comment and store in memory
                reply = serializer.save()
                if reply:
                    # Get the parent comment and add the reply in its responses
                    parent_comment.responses.add(reply)
                    # Add the user who comment the reply to post "users who comment"
                    post.users_who_comment.append(request.data["user"])
                    parent_comment.save()
                    post.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"Detail": "Data sent incorrectly"}, status=status.HTTP_400_BAD_REQUEST)
            

    # Update comment
    def put(self, request, id, format=None):
        comment = self.get_object(id)
        if comment is None:
            return Response({"Detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete comment
    def delete(self, request, id, format=None):
        comment = self.get_object(id)
        ownerUserId = request.data["ownerUserId"]
        comment_post = Post.objects.get(id__exact=request.data["postId"])
        if ownerUserId and comment_post and comment:
            comment.delete()
            related_comments_id = request.data.get("responses", [])
            if related_comments_id:
                related_comments = Comment.objects.filter(id__in=request.data["responses"])
                related_comments_users_id = list(related_comments.values_list('user', flat=True))
                for id in related_comments_users_id:
                    comment_post.users_who_comment.remove(id)
                comment_post.save()
                related_comments.delete()
            if ownerUserId in comment_post.users_who_comment:
                comment_post.users_who_comment.remove(ownerUserId)
                comment_post.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"Detail": "All needed data was not provided"}, status=status.HTTP_400_BAD_REQUEST)

class UpAndDownVotesComment(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):

        # Data
        user_who_vote_id = request.data['user_id']
        comment_id = request.data['comment_id']
        action = request.data['action']

        user_who_vote = User.objects.get(id__exact=user_who_vote_id)
        comment = Comment.objects.get(id__exact=comment_id)

        # Logic
        if action == 'up':
            if comment.users_who_vote_up.filter(id=user_who_vote_id).exists():
                comment.users_who_vote_up.remove(user_who_vote)
                comment.save()
                return Response({"Detail": "User who vote quit up vote"}, status=status.HTTP_200_OK)
            
            if comment.users_who_vote_down.filter(id=user_who_vote_id).exists():
                comment.users_who_vote_down.remove(user_who_vote)
            
            comment.users_who_vote_up.add(user_who_vote)
            comment.save()
            return Response({"Detail": "User is in up votes"}, status=status.HTTP_200_OK)
        
        elif action == 'down':
            if comment.users_who_vote_down.filter(id=user_who_vote_id).exists():
                comment.users_who_vote_down.remove(user_who_vote)
                comment.save()
                return Response({"Detail": "User who vote quit down vote"}, status=status.HTTP_200_OK)
            
            if comment.users_who_vote_up.filter(id=user_who_vote_id).exists():
                comment.users_who_vote_up.remove(user_who_vote)

            comment.users_who_vote_down.add(user_who_vote)
            comment.save()
            return Response({"Detail": "User is in down votes"}, status=status.HTTP_200_OK)
        return Response({"Detail": "No valid data sent"}, status=status.HTTP_400_BAD_REQUEST)

class GetMultipleComments(APIView):
    def post(self, request, format=None):
        comments = Comment.objects.filter(id__in=request.data['ids']).order_by('-id')
        if not comments.exists():
            return Response({"Detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)