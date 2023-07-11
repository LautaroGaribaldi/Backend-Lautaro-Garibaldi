exports.generateUserErrorInfo = (user) => {
    return `One or more properties ware incomplete or not valid.
    listado de requerimietos de propiedades del user:
    * firstName:  needs to a String, recived: ${user.firstName}
    * lastName:  needs to a String, recived: ${user.lastName}
    * email:  needs to a String, recived: ${user.email}
    * password:  needs to a String, recived: ${user.password}
    `;
};

exports.generateProductErrorInfo = (product) => {
    return `One or more properties ware incomplete or not valid.
    listado de requerimietos de propiedades del product:
    * title:  needs to a String, recived: ${product.title}
    * description:  needs to a String, recived: ${product.description}
    * price:  needs to a Int, recived: ${product.price}
    * code:  needs to a Int, recived: ${product.code}
    * category:  needs to a Int, recived: ${product.category}
    * stock:  needs to a Int, recived: ${product.stock}
    `;
};
