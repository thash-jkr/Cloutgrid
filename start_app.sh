#!/bin/bash

# Script to run both React and Django servers in separate gnome-terminal windows
gnome-terminal -- zsh -c "cd frontend && npm start; exec zsh"
# Start Django server in a new terminal window
gnome-terminal -- zsh -c "cd backend && source .djenv/bin/activate  && python manage.py runserver 0.0.0.0:8000; exec zsh"

