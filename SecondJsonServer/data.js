const apiUrl = "http://localhost:3000/items"; 

function generateReceipt() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Received data:", data); // Log the data to inspect its structure

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



// Funkcja dodająca nowy element
function addItem(event) {
    event.preventDefault();

    const itemName = document.getElementById("itemName").value;
    const itemQuantity = parseFloat(document.getElementById("itemQuantity").value);
    const itemPrice = parseFloat(document.getElementById("itemPrice").value);

    // Validation checks
    if (!itemName || isNaN(itemQuantity) || isNaN(itemPrice) || itemQuantity <= 0 || itemPrice <= 0) {
        alert("Please provide valid input for all fields.");
        return;
    }

    const newItem = {
        name: itemName,
        quantity: itemQuantity,
        unitPrice: itemPrice
    };

    // Log the new item to verify it is correct
    console.log("New Item:", newItem);

    // Make POST request to add new item
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
        generateReceipt(); // Update the receipt with the new item
        document.getElementById("addDialog").close(); // Close the add dialog
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Funkcja edytująca istniejący element
function editItem(itemId) {
    // Pobierz dane elementu z serwera
    fetch(`${apiUrl}/${itemId}`)
        .then(response => response.json())
        .then(item => {
            // Wypełnij formularz danymi elementu
            document.getElementById("editItemName").value = item.name;
            document.getElementById("editItemQuantity").value = item.quantity;
            document.getElementById("editItemPrice").value = item.unitPrice;

            // Przypisz id edytowanego elementu do ukrytego pola (np. w formularzu)
            document.getElementById("editDialog").showModal(); // Otwórz okno dialogowe do edycji
            currentEditItemId = itemId; // Przechowuj id edytowanego elementu
        });
}

// Funkcja aktualizująca edytowany element
function updateItem(event) {
    event.preventDefault(); // Zapobiegaj domyślnemu działaniu formularza

    const itemName = document.getElementById("editItemName").value;
    const itemQuantity = parseFloat(document.getElementById("editItemQuantity").value);
    const itemPrice = parseFloat(document.getElementById("editItemPrice").value);

    const updatedItem = {
        name: itemName,
        quantity: itemQuantity,
        unitPrice: itemPrice
    };

    // Wykonaj zapytanie PUT, aby zaktualizować produkt
    fetch(`${apiUrl}/${currentEditItemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem)
    })
    .then(response => response.json())
    .then(() => {
        generateReceipt(); // Zaktualizuj tabelę
        document.getElementById("editDialog").close(); // Zamknij dialog
    });
}

// Funkcja usuwająca element
function deleteItem(itemId) {
    // Show the confirmation dialog
    document.getElementById("deleteDialog").showModal();

    // Add event listeners for the buttons inside the dialog
    document.getElementById("confirmDeleteBtn").onclick = () => {
        // If the user confirms, delete the item
        fetch(`${apiUrl}/${itemId}`, {
            method: 'DELETE'
        })
        .then(() => {
            generateReceipt(); // Update the receipt after deletion
            document.getElementById("deleteDialog").close(); // Close the confirmation dialog
        })
        .catch(error => {
            console.error("Error deleting item:", error);
            document.getElementById("deleteDialog").close(); // Close the dialog even if an error occurs
        });
    };

    document.getElementById("cancelDeleteBtn").onclick = () => {
        // If the user cancels, just close the dialog
        document.getElementById("deleteDialog").close();
    };
}


// Funkcja obsługująca anulowanie dodawania elementu
document.getElementById("cancelAddBtn").addEventListener("click", () => {
    document.getElementById("addDialog").close(); // Zamknięcie dialogu bez dodawania
});

// Funkcja uruchamiająca otwieranie okna dialogowego do dodawania
document.getElementById("addItemBtn").addEventListener("click", () => {
    document.getElementById("addDialog").showModal(); // Otwórz dialog do dodawania elementu
});

// Funkcja uruchamiająca otwieranie okna dialogowego do edytowania
document.getElementById("editForm").addEventListener("submit", (event) => {
    updateItem(event); // Jeśli edytujemy, wykonaj update
});

// Przechowywanie id edytowanego elementu
let currentEditItemId = null;

window.addEventListener("load", generateReceipt);
