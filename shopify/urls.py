
# -*- coding: cp1252 -*-

from django.conf.urls import include, url
from rest_framework import routers
from shopify.views import OrderViewSet, ItemViewSet, ShippingViewSet, OrderDetailView, OrderListView

router = routers.DefaultRouter()
router.register(r'orders', OrderViewSet)
router.register(r'items', ItemViewSet)
router.register(r'shipping', ShippingViewSet)

urlpatterns = [

  url(r'^', include(router.urls)),
url(r'^listar/$', OrderListView.as_view(), name='order-list'),
  url(r'^detalle/(?P<pk>\d+)/$', OrderDetailView.as_view(), name='order-detail'),



]
