# Backend

Simple Express + MongoDB API for the notice board module.

Roles handled by the API:

- `principal`: can create, edit, delete, and read notices
- `teacher`: can edit and read notices
- `student`: can read notices
- `admin`: can delete and read notices

Request role is read from the `x-user-role` header.