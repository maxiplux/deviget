from django.contrib import admin

# Register your models here.
from shopify.models import Order, Shipping, Item




admin.site.register(Order)
admin.site.register(Shipping)
admin.site.register(Item)