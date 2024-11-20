const apiUrl = "http://localhost:3000/items"; 

function generateReceipt() {
    fetch(apiUrl,
        {
            method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    ).then(response => response.json())
    .then(data => {
            console.log("Received data:", data); 

            // Check if the response is an array
            if (!Array.isArray(data)) {
                console.error("Data is not an array", data);
                return; // Exit early if data is not an array
            }

            const tableBody = document.querySelector("#receiptTable tbody");
            tableBody.innerHTML = ""; 
            let totalAmount = 0;

            // Loop through the items array
            data.forEach((item, index) => {
                const totalPrice = item.quantity * item.unitPrice;
                totalAmount += totalPrice;

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice.toFixed(2)} zł</td>
                    <td>${totalPrice.toFixed(2)} zł</td>
                    <td>
                        <span class="material-symbols-outlined" style="cursor: pointer;" onclick="editItem('${item.id}')">
                            edit
                        </span>
                        <span class="material-symbols-outlined" style="cursor: pointer;" onclick="deleteItem('${item.id}')">
                            delete
                        </span>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            document.getElementById("totalAmount").textContent = totalAmount.toFixed(2) + " zł";
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}




function addItem(event) {
    event.preventDefault();

    const itemName = document.getElementById("itemName").value;
    const itemQuantity = parseFloat(document.getElementById("itemQuantity").value);
    const itemPrice = parseFloat(document.getElementById("itemPrice").value);

 
    if (!itemName || isNaN(itemQuantity) || isNaN(itemPrice) || itemQuantity <= 0 || itemPrice <= 0) {
        alert("Please provide valid input for all fields.");
        return;
    }

    const newItem = {
        name: itemName,
        quantity: itemQuantity,
        unitPrice: itemPrice
    };

   
    console.log("New Item:", newItem);

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to add item:', response.statusText);
            throw new Error('Failed to add item');
        }
        return response.json();
    })
    .then((data) => {
        console.log("Added item:", data);
        generateReceipt(); 
        document.getElementById("addDialog").close(); 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function editItem(itemId) {
    fetch(`${apiUrl}/${itemId}`)
        .then(response => response.json())
        .then(item => {
            document.getElementById("editItemName").value = item.name;
            document.getElementById("editItemQuantity").value = item.quantity;
            document.getElementById("editItemPrice").value = item.unitPrice;
            document.getElementById("editDialog").showModal(); 
            currentEditItemId = itemId; 
        });
}


function updateItem(event) {
    event.preventDefault();

    const itemName = document.getElementById("editItemName").value;
    const itemQuantity = parseFloat(document.getElementById("editItemQuantity").value);
    const itemPrice = parseFloat(document.getElementById("editItemPrice").value);

    const updatedItem = {
        name: itemName,
        quantity: itemQuantity,
        unitPrice: itemPrice
    };

 
    fetch(`${apiUrl}/${currentEditItemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem)
    })
    .then(response => response.json())
    .then(() => {
        generateReceipt(); 
        document.getElementById("editDialog").close(); 
    });
}


function deleteItem(itemId) {
  
    document.getElementById("deleteDialog").showModal();


    document.getElementById("confirmDeleteBtn").onclick = () => {

        fetch(`${apiUrl}/${itemId}`, {
            method: 'DELETE'
        })
        .then(() => {
            generateReceipt(); 
            document.getElementById("deleteDialog").close(); 
        })
        .catch(error => {
            console.error("Error deleting item:", error);
            document.getElementById("deleteDialog").close(); 
        });
    };

    document.getElementById("cancelDeleteBtn").onclick = () => {
       
        document.getElementById("deleteDialog").close();
    };
}



document.getElementById("cancelAddBtn").addEventListener("click", () => {
    document.getElementById("addDialog").close(); 
});


document.getElementById("addItemBtn").addEventListener("click", () => {
    document.getElementById("addDialog").showModal(); 
});


document.getElementById("editForm").addEventListener("submit", (event) => {
    updateItem(event); 
});


let currentEditItemId = null;

window.addEventListener("load", generateReceipt);
