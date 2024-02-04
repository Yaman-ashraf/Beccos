const roles = {
    Admin: 'Admin',
    User: 'User',
}

const endPoint = {
    addToCart: [roles.User],
    removeItem: [roles.User],
    updateQuantity: [roles.User],
    getCart: [roles.User],
}

export default endPoint;
