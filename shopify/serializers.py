from django.forms import widgets
from rest_framework import serializers
from shopify.models import Order, Item, Shipping


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"

class ShippingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipping
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    #shipping_address = ShippingSerializer(many=True, required=False)
    line_items=ItemSerializer(many=True)


    class Meta:
        model = Order
        fields = ['total_price','total_discounts','order_number','email','line_items']
    def create(self, validated_data):


        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        instance=Order()
        instance.email = validated_data.get('email', "")
        instance.total_price = validated_data.get('total_price', "")
        instance.total_discounts = validated_data.get('total_discounts', "")
        instance.order_number = validated_data.get('order_number', "")
        instance.save()

        line_items = validated_data.get('line_items',[])
        for post in line_items:
            item=Item.objects.create(**post)
            instance.line_items.add(item)
        # shipping_address = validated_data.pop('shipping_address')
        # list_shi=[]
        # for sh in shipping_address:
        #     d=dict(sh)
        #     shiping=Shipping(first_name=d['first_name'],address1=d['address1'],phone=d['phone'],city=d['city'],province=d['province'],country=d['country'])
        #     shiping.save()
        #
        #     instance.shipping_address.add(shiping)


        instance.save()

        return instance

    def update(self, instance, validated_data):
        """
        Update and return an existing `Snippet` instance, given the validated data.
        """
        instance.title = validated_data.get('title', instance.title)
        instance.code = validated_data.get('code', instance.code)
        instance.linenos = validated_data.get('linenos', instance.linenos)
        instance.language = validated_data.get('language', instance.language)
        instance.style = validated_data.get('style', instance.style)
        instance.save()
        return instance


