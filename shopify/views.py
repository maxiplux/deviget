
from django.shortcuts import render
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import DetailView
from django.views.generic import ListView
from rest_framework import viewsets
from shopify.models import Order, Shipping, Item
from shopify.serializers import OrderSerializer, ShippingSerializer, ItemSerializer
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
import json
import pickle


class PublicEndpoint(permissions.BasePermission):
    def has_permission(self, request, view):
        return True


class OrderListView(ListView):
    model = Order
    def get_context_data(self, **kwargs):
        context = super(OrderListView, self).get_context_data(**kwargs)
        context['now'] = timezone.now()
        return context



class OrderDetailView(DetailView):

    model = Order
    def get_context_data(self, **kwargs):
        context = super(OrderDetailView, self).get_context_data(**kwargs)
        context['now'] = timezone.now()
        return context

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (PublicEndpoint,)

    def create(self, request, *args, **kwargs):




        #{"order_number": "222222222", "csrfmiddlewaretoken": "oZHZx5eA5RqEvbHTfIKM4kth1cihJktjp16JZAmdjLorZFZFfXerEhwpAaofoiZS", "total_price": "5555555555555", "total_discounts": "5555555555555", "email": "5"}

        #for k,v in request.data.iteritems():
        #    f.write("%s:%s"%(k,v)+"\n")
        # depurador
        #with open('pruebafinal.txt', 'wb') as f:
        #    pickle.dump(request.data, f)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)



        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)






class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (PublicEndpoint,)

class ShippingViewSet(viewsets.ModelViewSet):
    queryset = Shipping.objects.all()
    serializer_class = ShippingSerializer
    permission_classes = (PublicEndpoint,)

