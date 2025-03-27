from django.contrib.auth.models import AbstractUser 
from django.db import models

class User(AbstractUser):
    id = models.AutoField(primary_key=True)  
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    dob = models.DateField(null=True, blank=True) 
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name

    def delete(self, *args, **kwargs):
        # Delete related objects before deleting user
        self.delete_related_objects()
        super().delete(*args, **kwargs)

    def delete_related_objects(self):
        for related_object in self._meta.related_objects:
            related_name = related_object.related_name
            if related_name:
                related_manager = getattr(self, related_name)
                related_manager.all().delete()
