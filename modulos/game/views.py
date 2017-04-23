# -*- coding: utf-8 -*-
from __future__ import unicode_literals


from django.shortcuts import render

from django.views.generic import TemplateView
from rest_framework import viewsets
from modulos.game.models import GameResult
from modulos.game.serializers import GameResultSerializer
from rest_framework import permissions


class PublicEndpoint(permissions.BasePermission):
    def has_permission(self, request, view):
        return True



class GameResultViewSet(viewsets.ModelViewSet):
    queryset = GameResult.objects.all()
    serializer_class = GameResultSerializer
    permission_classes = (PublicEndpoint,)


class PlayView(TemplateView):
	template_name = "modulos/play.html"
