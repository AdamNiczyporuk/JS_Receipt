const apiUrl = "http://localhost:3000/items";

// Funkcja generująca paragon
function generateReceipt() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Received data:", data);

            if (!Array.isArray(data)) {
                console.error("Data is not an array", data);
                return;
            }

            const tableBody = document.querySelector("#receiptTable tbody");
            tableBody.innerHTML = "";
            let totalAmount = 0;

            data.forEach((item, index) => {
                // Używamy klucza price lub unitPrice w zależności od tego, który istnieje
                const price = item.unitPrice !== undefined ? item.unitPrice : item.price;
            
                // Jeśli cena jest poprawna, obliczamy całkowitą cenę
                if (price !== undefined && !isNaN(price)) {
                    const totalPrice = item.quantity * price;
                    totalAmount += totalPrice;
            
                    const row = document.createElement("tr");
            
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${price.toFixed(2)} zł</td>
                        <td>${totalPrice.toFixed(2)} zł</td>
                        <td>
                            <span class="material-symbols-outlined" style="cursor: pointer;" onclick="editItem(${item.id})">edit</span>
                            <span class="material-symbols-outlined" style="cursor: pointer;" onclick="deleteItem(${item.id})">delete</span>
                        </td>
                    `;
                    tableBody.appendChild(row);
                } else {
                    console.error("Invalid price for item:", item);
                }
            });

            document.getElementById("totalAmount").textContent = totalAmount.toFixed(2) + " zł";
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

// Funkcja dodająca nowy element
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

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Added item:", data);
        generateReceipt(); 
        document.getElementById("addDialog").close(); 
    })
    .catch(error => {
        console.error('Error:', error);
    });
    document.getElementById("itemName").value = "";
    document.getElementById("itemQuantity").value = "";
    document.getElementById("itemPrice").value = "";
}

function editItem(itemId) {
    fetch(apiUrl)  // Pobieramy wszystkie elementy
        .then(response => response.json())
        .then(data => {
            // Szukamy elementu o podanym id
            const item = data.find(i => i.id === itemId);
            console.log(item);
            if (!item) {
                console.error("Item not found with id:", itemId);
                return;
            }

            // Ustawiamy wartości w formularzu edycji
            document.getElementById("editItemName").value = item.name;
            document.getElementById("editItemQuantity").value = item.quantity;
            document.getElementById("editItemPrice").value = item.unitPrice;

            // Otwieramy dialog edycji
            document.getElementById("editDialog").showModal();
            currentEditItemId = itemId; // Ustawiamy ID edytowanego elementu
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

// Funkcja aktualizująca edytowany element
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
        generateReceipt(); // Odświeżenie tabeli
        document.getElementById("editDialog").close();
    })
    .catch(error => {
        console.error("Error updating item:", error);
    });
}

// Funkcja usuwająca element
function deleteItem(itemId) {
    document.getElementById("deleteDialog").showModal();

    document.getElementById("confirmDeleteBtn").onclick = () => {
        fetch(`${apiUrl}/${itemId}`, { method: 'DELETE' })
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

// Funkcja obsługująca anulowanie dodawania elementu
document.getElementById("cancelAddBtn").addEventListener("click", () => {
    document.getElementById("addDialog").close();
});

// Funkcja uruchamiająca otwieranie okna dialogowego do dodawania
document.getElementById("addItemBtn").addEventListener("click", () => {
    document.getElementById("addDialog").showModal();
});

// Funkcja uruchamiająca otwieranie okna dialogowego do edytowania
document.getElementById("editForm").addEventListener("submit", (event) => {
    updateItem(event);
});

// Przechowywanie id edytowanego elementu
let currentEditItemId = null;

window.addEventListener("load", generateReceipt);
