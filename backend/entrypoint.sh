#!/bin/sh

echo "Waiting for MongoDB to start..."
sleep 5  # Wait for MongoDB to initialize

echo "Setting up Django environment..."
export DJANGO_SETTINGS_MODULE=free_mentors.settings

echo "Running migrations..."
python mentorship/create_admin.py  # Create the admin user

echo "Starting Django server..."
exec python manage.py runserver 0.0.0.0:8000
