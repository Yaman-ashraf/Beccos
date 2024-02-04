

const runDataTable = ({excelTitle='Title',pdfTitle='Title',printTitle='Title'}) => {
    $("#categoryTable").DataTable().destroy();

    $(function () {
        $("#categoryTable").DataTable({
            responsive: true,
        lengthChange: false,
        autoWidth: false,
      //  "buttons": [ "csv", "excel", "pdf", "print", "colvis"],
        buttons: [
            { extend: 'print', title: printTitle },
            { extend: 'excel', title: excelTitle},
            { extend: 'pdf', title: pdfTitle},
            'colvis'
        ],

        dom: "Bfrtip", // يحدد مكان ظهور الأزرار
        pagingType: "full_numbers",
        searching: true,
        ordering: true,
        info: true,
        autoWidth: false,
        responsive: true,
      });
    });
  };

  const runUsersDataTable = ({excelTitle='Title',pdfTitle='Title',printTitle='Title'}) => {
    $("#orderTable").DataTable().destroy();

    $(function () {
      $("#orderTable").DataTable({
        responsive: true,
        lengthChange: false,
        autoWidth: false,
      //  "buttons": [ "csv", "excel", "pdf", "print", "colvis"],
        buttons: [
            { extend: 'print', title: printTitle },
            { extend: 'excel', title: excelTitle},
            { extend: 'pdf', title: pdfTitle},
            'colvis'
        ],

        dom: "Bfrtip", // يحدد مكان ظهور الأزرار
        pagingType: "full_numbers",
        searching: true,
        ordering: true,
        info: true,
        autoWidth: false,
        responsive: true,
      });
    });
  };
const topSellingProducts = async()=>{
    const token = localStorage.getItem('adminToken');
    const {data} = await axios.get(`https://beccos.vercel.app/order/getSellingProduct`,
    {
        headers:{authorization:`BECCOS__${token}`}
    });
    console.log(data);
    return data;
}

const displayProducts = async () => {
    try {
        const data = await topSellingProducts();
        const result = data.topSellingProducts.map((product) => {
            const productDetails = product.productDetails.map((detail) => {
                return `
                    <tr>
                        <td><img src="${detail.image.secure_url}" width="100px" /></td>
                        <td>${detail.name}</td>
                        <td>${detail.stock}</td>
                        <td>${detail.price}</td>
                        <td>${detail.discount}</td>
                        <td>${detail.finalPrice}</td>
                        <td>${product.totalQuantity}</td> <!-- Include totalQuantity here -->

                    </tr>
                `;
            }).join("");

            return productDetails; // Return productDetails here
        }).join("");

        document.querySelector(".products").innerHTML = result;
        runUsersDataTable({excelTitle:'top Selling Products',pdfTitle:'top Selling Products ',printTitle:'top Selling Products'});
    } catch (error) {
        console.error('Error:', error);
    }
};

  displayProducts();



  const usersOrdersReport = async () => {
    try {
        const token = localStorage.getItem('adminToken');
        const { data } = await axios.get(`https://beccos.vercel.app/order/getUsersOrdersReport`, {
            headers: { authorization: `BECCOS__${token}` }
        });

        let result = '';
console.log(data.usersOrders);
        data.usersOrders.forEach((order) => {
            result += `
                <tr>
                    <td>${order.user[0].name}</td>
                    <td>${order.ordersCount}</td>
                    <td>${order.totalCost}</td>
                </tr>
            `;
        });

        const userOrdersTable = document.querySelector(".userOrders");
        if (userOrdersTable) {
            userOrdersTable.innerHTML = result;
            runDataTable({ excelTitle: 'Users Orders Report', pdfTitle: 'Users Orders Report', printTitle: 'Users Orders Report' });
        } else {
            console.error('User orders table element not found');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


usersOrdersReport();
