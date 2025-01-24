from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from app.serializers import SnippetSerializer
from app.models import Snippet, User, Skill
from rest_framework.pagination import PageNumberPagination


class SnippetPagination(PageNumberPagination):
    page_size = 4


class SnippetView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = SnippetPagination

    # Get an object / instance
    def get_object(self, id):
        try:
            return Snippet.objects.get(id=id)
        except Snippet.DoesNotExist:
            return None

    # Get all user snippets using the user id
    def get_all_user_snippets(self, request, id):
        query = request.query_params.get('query')
        snippets = None
        if query and len(query) >= 1:
            snippets = Snippet.objects.filter(user=id, title__icontains=query)
        else:
            snippets = Snippet.objects.filter(user=id)
        if snippets.exists():
            # Pagination in a APIView function. Desc order by default
            paginator = self.pagination_class()
            page = paginator.paginate_queryset(snippets, request)

            serializer = SnippetSerializer(page, many=True)
            # Paginator already return a Response object
            # Data will be returned in a "results" property
            return paginator.get_paginated_response(serializer.data)
        return Response({"Detail": "No Snippets Found"}, status=status.HTTP_404_NOT_FOUND)

    # ----------------------------------------------

    # Get snippet or snippets
    def get(self, request, id=None, user_id=None, format=None):
        if id:
            snippet = self.get_object(id)
            if snippet is None:
                return Response({"Detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = SnippetSerializer(snippet)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif user_id:
            return self.get_all_user_snippets(request, user_id)
        return Response({"Detail": "Invalid Request"}, status=status.HTTP_400_BAD_REQUEST)

    # Create snippet
    def post(self, request, format=None):
        # Get the data and lookup for the corresponding model instances...
        # for the related fields
        user = User.objects.get(id__exact=request.data["user"]).pk
        language = Skill.objects.get(name__exact=request.data["language"]["value"]).pk
        extractTechnologies = [item["value"] for item in request.data["technology"]]
        technology = Skill.objects.filter(name__in=extractTechnologies).values_list(
            "pk", flat=True
        )
        # Prepare the data to create a new instance of Snippet model
        data_to_serialize = {
            "title": request.data["title"],
            "description": request.data["description"],
            "user": user,
            "code": request.data["code"],
            "language": language,
            "language_name": request.data["language"],
            "technology": technology,
            "technology_names": request.data["technology"],
        }
        # Serialize the data and save the new instance
        serializer = SnippetSerializer(
            data=data_to_serialize, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors, "serializer errorssssssssss")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Update snippet
    def put(self, request, id, format=None):
        snippet = self.get_object(id)
        if snippet is None:
            return Response({"Detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        request.data["language"] = Skill.objects.get(
            name__exact=request.data["language"]["value"]
        ).pk
        extractTechnologies = [item["value"] for item in request.data["technology"]]
        request.data["technology"] = Skill.objects.filter(
            name__in=extractTechnologies
        ).values_list("pk", flat=True)
        serializer = SnippetSerializer(snippet, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete snippet
    def delete(self, request, id, format=None):
        snippet = self.get_object(id)
        if snippet is None:
            return Response({"Detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        snippet.delete()
        return Response({"Detail": "Snippet Deleted"}, status=status.HTTP_204_NO_CONTENT)


class SnippetView2(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, format=None):
        snippetIds = request.data['snippetIds']
        snippets = Snippet.objects.filter(id__in=snippetIds)
        if snippets:
            serializer = SnippetSerializer(snippets, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"Detail": "No Snippet Found"}, status=status.HTTP_404_NOT_FOUND)