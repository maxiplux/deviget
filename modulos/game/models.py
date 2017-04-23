# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import pyclbr

from django.db import models

# Create your models here.
from modulos.maestras.models import MaestraSimple


class GameResult(MaestraSimple):
	cols = models.PositiveIntegerField(default=0)
	rows= models.PositiveIntegerField(default=0)
	mines= models.PositiveIntegerField(default=0)
	difficulty= models.CharField(max_length=20)
	time= models.CharField(max_length=20)
	username= models.CharField(max_length=20)

# automatic admin generate helper
def clases():
    for clase in pyclbr.readmodule(__name__).keys():
        if clase not in []:
            yield eval(clase)
