from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from app.serializers import SkillSerializer
from app.models import Skill
from rest_framework.generics import get_object_or_404


class SkillView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Get an object / instance
    def get_object(self, request, id):
        try:
            return get_object_or_404(Skill, id=id)
        except Skill.DoesNotExist:
            return None
    
    # Get all skills available
    def get_all_skills(self, request):
        skills = Skill.objects.all()
        if skills.exists():
            serializer = SkillSerializer(skills, context={'request': request}, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"Detail": "No Skills Found"}, status=status.HTTP_404_NOT_FOUND)

    # --------------------------------------------------

    # Get skill or skills
    def get(self, request, id=None, format=None):

        if id:
            skill = self.get_object(id)
            if skill is None:
                return Response({"Detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = SkillSerializer(skill, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        return self.get_all_skills(request)
        