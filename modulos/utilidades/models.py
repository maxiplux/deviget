from __future__ import unicode_literals

from django.db import models

# Create your models here.
def get_or_none(classmodel, **kwargs):
    try:
        return classmodel.objects.get(**kwargs)
    except classmodel.DoesNotExist:
        return None