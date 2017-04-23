#from __future__ import unicode_literals

from django.db import models

class Item(models.Model):
	title = models.CharField(max_length=50,null=True,blank=True)
	quantity = models.CharField(max_length=50,null=True,blank=True)
	price = models.CharField(max_length=50,null=True,blank=True)
	vendor = models.CharField(max_length=50,null=True,blank=True)
	product_id = models.CharField(max_length=50,null=True,blank=True)
	total_discount = models.CharField(max_length=50,null=True,blank=True)

	class Meta:
		ordering = ["title"]
		verbose_name_plural = "Items"

	def __str__(self): # __unicode__ en Python 2
		return self.title

class Shipping(models.Model):
	first_name = models.CharField(max_length=50)
	address1 = models.CharField(max_length=50)
	phone = models.CharField(max_length=50)
	city = models.CharField(max_length=50)
	province = models.CharField(max_length=50)
	country = models.CharField(max_length=50)

	class Meta:
		ordering = ["first_name"]
		verbose_name_plural = "Shipping"

	def __str__(self): # __unicode__ en Python 2
		return self.first_name




class Order(models.Model):
	email = models.CharField(max_length=50,null=True,blank=True)
	total_price = models.CharField(max_length=50,null=True,blank=True)
	total_discounts = models.CharField(max_length=50,null=True,blank=True)
	order_number = models.CharField(max_length=50,null=True,blank=True)
	line_items = models.ManyToManyField(Item,null=True,blank=True)
	shipping_address = models.ManyToManyField(Shipping,null=True,blank=True)


	class Meta:
		ordering = ["order_number"]
		verbose_name_plural = "Orders"

	def __str__(self): # __unicode__ en Python 2 
		return self.order_number