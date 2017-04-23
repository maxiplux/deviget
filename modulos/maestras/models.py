from __future__ import unicode_literals

from django.db import models

# Create your models here.
# Create your models here.
from simple_history.models import HistoricalRecords


class MaestraBase(models.Model):
    nombre = models.CharField(max_length=500, blank=True)
    creado = models.DateTimeField(auto_now_add=True) # fecha de creacion
    modificado = models.DateTimeField(auto_now=True)# las_modify ultima modificacion
    activo = models.BooleanField(default=True)
    filter_especial = []

    class Meta:
        abstract = True

    def __unicode__(self):
        return u'%s' % (self.nombre)

    @classmethod
    def GetFieldsAdmin(self):
        fields_tmp = self._meta.fields
        fields_tmp = map(lambda x: x.name, fields_tmp)
        return [x for x in fields_tmp if x not in ['id', 'creado', 'modificado','observaciones','comentarios']]


    @classmethod
    def GetFieldsEspecialFilter(self):
        return self.filter_especial

    @classmethod
    def GetFieldsForeignKeyAdmin(self):
        fields_tmp = []

        for i in self._meta.fields:
            if i.rel and i.name not in ['id', 'creado', 'modificado']:
                fields_tmp.append(i)
        return map(lambda x: x.name, fields_tmp)

    @classmethod
    def GetFieldsManyToManyKeyAdmin(self):
        fields_tmp = []
        for i in self._meta.fields:
            if type(i) in [models.ManyToManyField]:
                fields_tmp.append(i)
        return map(lambda x: x.name, fields_tmp)


    @classmethod
    def GetFieldsForeignKeyResource(self):
        fields_tmp = []
        for i in self._meta.fields:
            if i.rel and i.name not in ['id', 'creado', 'modificado']:
                fields_tmp.append(i)
        return map(lambda x: x.name + "__nombre", fields_tmp)

    @classmethod
    def WhoAmI(self):
        return self.__name__

    @classmethod
    def WhoAmIAdmin(self):
        return self.__name__ + "Admin"

    @classmethod
    def GetFieldsSearchAdmin(self):
        fields_tmp = []
        for i in self._meta.fields:
            if type(i) in [models.CharField, models.BigIntegerField, models.PositiveIntegerField, models.EmailField,
                           models.IntegerField]:
                fields_tmp.append(i)
        return map(lambda x: x.name, fields_tmp)

    @classmethod
    def GetFieldsForeignKeyImportExport(self):
        #only for export data with django import and export is a little magic
        fields_tmp = []
        for field in self._meta.fields:
            if field.get_internal_type() == "ForeignKey":
                to=field.rel.to
                if to.__bases__[0]==Maestra:
                    fields_tmp.append(field.name)
        return fields_tmp
    @classmethod
    def GetFieldsBooleanImportExport(self):
        #only for export data with django import and export is a little magic
        fields_tmp = []
        for field in self._meta.fields:
            if field.get_internal_type() in ['BooleanField', "NullBooleanField" ]:
                fields_tmp.append(field.name)
        return fields_tmp


# Create your models here.
class Maestra(models.Model):
    nombre = models.CharField(max_length=255, blank=True, unique=True)
    creado = models.DateTimeField(auto_now_add=True) # fecha de creacion
    modificado = models.DateTimeField(auto_now=True)# las_modify ultima modificacion
    activo = models.BooleanField(default=True, editable=False)
    filter_especial = []
    history = HistoricalRecords()

    class Meta:
        abstract = True

    def __str__(self):
        return u'%s' % (self.nombre)

    def __unicode__(self):
        return u'%s' % (self.nombre)

    @classmethod
    def GetFieldsEspecialFilter(self):
        return self.filter_especial

    @staticmethod
    def autocomplete_search_fields():
        return ("id__iexact", "nombre__icontains",)

    @classmethod
    def GetFieldsAdmin(self):
        fields_tmp = self._meta.fields
        fields_tmp = map(lambda x: x.name, fields_tmp)
        return [x for x in fields_tmp if x not in ['id', 'creado', 'modificado','observaciones','comentarios']]

    @classmethod
    def GetFieldsManyToManyKeyAdmin(self):
        fields_tmp = []

        m2m=[
    (f, f.model if f.model != self else None)
    for f in self._meta.get_fields()
    if f.many_to_many and not f.auto_created
    ]

        for i,j in m2m:

            if type(i) in [models.ManyToManyField]:
                fields_tmp.append(i)
        return map(lambda x: x.name, fields_tmp)


    @classmethod
    def GetFieldsForeignKeyAdmin(self):
        fields_tmp = []
        for i in self._meta.fields:
            if i.rel and i.name not in ['id', 'creado', 'modificado']:
                fields_tmp.append(i)
        return map(lambda x: x.name, fields_tmp)

    @classmethod
    def GetFieldsForeignKeyResource(self):
        fields_tmp = []
        for i in self._meta.fields:
            if i.rel and i.name not in ['id', 'creado', 'modificado']:
                fields_tmp.append(i)
        return map(lambda x: x.name + "__nombre", fields_tmp)

    @classmethod
    def WhoAmI(self):
        return self.__name__

    @classmethod
    def WhoAmIAdmin(self):
        return self.__name__ + "Admin"

    @classmethod
    def GetFieldsSearchAdmin(self):
        fields_tmp = []
        for i in self._meta.fields:
            if type(i) in [models.CharField, models.BigIntegerField, models.PositiveIntegerField, models.EmailField,
                           models.IntegerField]:
                fields_tmp.append(i)
        return map(lambda x: x.name, fields_tmp)

    @classmethod
    def GetFieldsForeignKeyImportExport(self):
        #only for export data with django import and export is a little magic
        fields_tmp = []
        for field in self._meta.fields:
            if field.get_internal_type() == "ForeignKey":
                to=field.rel.to
                if to.__bases__[0]==Maestra:
                    fields_tmp.append(field.name)
        return fields_tmp
    @classmethod
    def GetFieldsBooleanImportExport(self):
        #only for export data with django import and export is a little magic
        fields_tmp = []
        for field in self._meta.fields:
            if field.get_internal_type() in ['BooleanField', "NullBooleanField" ]:
                fields_tmp.append(field.name)
        return fields_tmp



# Create your models here.
class MaestraSimple(models.Model):
    creado = models.DateTimeField(auto_now_add=True) # fecha de creacion
    modificado = models.DateTimeField(auto_now=True)# las_modify ultima modificacion
    activo = models.BooleanField(default=True)
    filter_especial=[]
    history = HistoricalRecords()




    class Meta:
        abstract = True


    @classmethod
    def GetFieldsEspecialFilter(self):
        return self.filter_especial

    @classmethod
    def GetFieldsAdmin(self):
        fields_tmp = self._meta.fields
        fields_tmp = map(lambda x: x.name, fields_tmp)
        k=[x for x in fields_tmp if x not in ['id', 'creado', 'modificado','observaciones','archivo','comentarios','texto_ejemplo','texto_color','texto','descripcion']]
        k.sort()
        return k


    @classmethod
    def GetFieldsManyToManyKeyAdmin(self):
        fields_tmp = []
        for i in [models.ManyToManyField]:
            if type(i) in [models.ManyToManyField]:
                fields_tmp.append(i)
        return map(lambda x: x.name, fields_tmp)


    @classmethod
    def GetFieldsForeignKeyAdmin(self):
        fields_tmp = []
        for i in self._meta.fields:
            if i.rel and i.name not in ['id', 'creado', 'modificado']:
                fields_tmp.append(i)
        return map(lambda x: x.name, fields_tmp)

    @classmethod
    def GetFieldsForeignKeyResource(self):
        fields_tmp = []
        for i in self._meta.fields:
            if i.rel and i.name not in ['id', 'creado', 'modificado']:
                fields_tmp.append(i)
        return map(lambda x: x.name + "__nombre", fields_tmp)

    @classmethod
    def WhoAmI(self):
        return self.__name__

    @classmethod
    def WhoAmIAdmin(self):
        return self.__name__ + "Admin"

    @classmethod
    def GetFieldsSearchAdmin(self):
        fields_tmp = []
        for i in self._meta.fields:
            if i in [models.CharField, models.BigIntegerField, models.PositiveIntegerField, models.EmailField,
                           models.IntegerField]:
                fields_tmp.append(i)
        return map(lambda x: x.name, fields_tmp)

    @classmethod
    def GetFieldsForeignKeyImportExport(self):
        #only for export data with django import and export is a little magic
        fields_tmp = []
        for field in self._meta.fields:
            if field.get_internal_type() == "ForeignKey":
                to=field.rel.to
                if to.__bases__[0]==MaestraSimple:
                    fields_tmp.append(field.name)
        return fields_tmp
    @classmethod
    def GetFieldsBooleanImportExport(self):
        #only for export data with django import and export is a little magic
        fields_tmp = []
        for field in self._meta.fields:
            if field.get_internal_type() in ['BooleanField', "NullBooleanField" ]:
                fields_tmp.append(field.name)
        return fields_tmp