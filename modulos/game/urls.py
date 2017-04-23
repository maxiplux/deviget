# -*- coding: cp1252 -*-

from django.conf.urls import include, url
from rest_framework import routers

from modulos.game.views import PlayView, GameResultViewSet, SimpleLoginView, GameResultListView

router = routers.DefaultRouter()
router.register(r'play_game', GameResultViewSet)

urlpatterns = [
	url(r'^api/v1', include(router.urls)),
	url(r'^$', SimpleLoginView.as_view(), name='login_game'),
	url(r'^play/$', PlayView.as_view(), name='play_game'),
	url(r'^show-results/$', GameResultListView.as_view(), name='show_blackboard'),

]
