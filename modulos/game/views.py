# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import get_object_or_404

from django.views.generic import TemplateView
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.authtoken.models import Token

from modulos.game.models import GameResult
from modulos.game.serializers import GameResultSerializer


class PublicEndpoint(permissions.BasePermission):
	def has_permission(self, request, view):
		return True


class GameResultViewSet(viewsets.ModelViewSet):
	queryset = GameResult.objects.all()
	serializer_class = GameResultSerializer
	permission_classes = (PublicEndpoint,)


class SimpleLoginView(TemplateView):
	template_name = "modulos/login.html"


class PlayView(TemplateView):
	template_name = "modulos/play.html"

	def get_context_data(self, **kwargs):
		context = super(PlayView, self).get_context_data(**kwargs)
		context['token'] = self.request.GET.get('token', '0')

		token=get_object_or_404(Token,key=self.request.GET.get('token', '0'))
		context['username'] =token.user.username

		return context
