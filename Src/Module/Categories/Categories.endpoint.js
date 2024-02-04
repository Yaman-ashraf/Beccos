const roles = {
    Admin:'Admin',
    User:'User',
}

const  endPoint = {
    create:[roles.Admin,roles.SuperAdmin],
    getAll:[roles.Admin],
    delete:[roles.Admin],
    update:[roles.Admin]

}

export default endPoint;
