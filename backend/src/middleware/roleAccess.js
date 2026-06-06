const roleOrder = {
  student: 1,
  teacher: 2,
  principal: 3,
  admin: 4
};

export const getUserRole = (req) => {
  const role = String(req.header('x-user-role') || 'student').toLowerCase();
  return roleOrder[role] ? role : 'student';
};

export const allowRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = getUserRole(req);

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'You are not allowed to do this action.' });
    }

    req.userRole = userRole;
    next();
  };
};

export const canEditNotice = (userRole) => roleOrder[userRole] >= roleOrder.teacher;
export const canDeleteNotice = (userRole) => userRole === 'principal' || userRole === 'admin';