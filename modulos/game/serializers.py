from django.forms import widgets
from rest_framework import serializers
from modulos.game.models import GameResult


class GameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameResult
        fields = "__all__"

