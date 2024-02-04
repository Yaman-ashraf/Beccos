const roles = {
    Admin: 'Admin',
    User: 'User',
}

const endPoint = {
    create: [roles.User],
    getUserOrder: [roles.User],
    cancel: [roles.User],
    changeStatus: [roles.Admin],
    allOrder: [roles.Admin],
    details: [roles.Admin, roles.User],
    updateShipping: [roles.Admin],
    reports: [roles.Admin]


}

export default endPoint;
