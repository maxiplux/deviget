# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
from modulos.game.models import clases
from modulos.utilidades.utiladmin import GenerateAdmins

GenerateAdmins(clases())