# -*- coding: cp1252 -*-
__author__ = 'Juan'
from django.contrib import admin
from django.http import HttpResponse
from import_export.admin import ImportExportModelAdmin

from django.core.exceptions import PermissionDenied
def GenerateAdmins(lista):
    for clase in lista:

        new_class = type(str(clase.WhoAmIAdmin()), (ImportExportModelAdmin,), {
            'list_display':clase.GetFieldsAdmin(),
            'list_filter':clase.GetFieldsForeignKeyAdmin()+clase.GetFieldsManyToManyKeyAdmin()+clase.GetFieldsEspecialFilter() ,
            'filter_horizontal' :clase.GetFieldsManyToManyKeyAdmin(),
            'raw_id_fields':clase.GetFieldsForeignKeyAdmin() ,
            'search_fields':clase.GetFieldsSearchAdmin(),
        })
        admin.site.register(clase,new_class)