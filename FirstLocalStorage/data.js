// Inicjalizacja paragonu z localStorage
let receiptItems = JSON.parse(localStorage.getItem("receiptItems")) || [];
let currentEditIndex = null;

// Funkcja generująca paragon
function generateReceipt(items) {
    const tableBody = document.querySelector("#receiptTable tbody");
    tableBody.innerHTML = ""; // Wyczyść istniejący widok
    let totalAmount = 0;

    items.forEach((item, index) => {
        const totalPrice = item.quantity * item.unitPrice;
        totalAmount += totalPrice;

        // Tworzenie wiersza tabeli
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.unitPrice.toFixed(2)} zł</td>
            <td>${totalPrice.toFixed(2)} zł</td>
            <td>
                <span class="material-symbols-outlined" style="cursor: pointer;" onclick="editItem(${index})">
                    edit
                </span>
                <span class="material-symbols-outlined" style="cursor: pointer;" onclick="showDeleteDialog(${index})">
                    delete
                </span>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Wyświetlenie łącznej kwoty
    document.getElementById("totalAmount").textContent = totalAmount.toFixed(2) + " zł";
}

// Funkcja dodająca nowy element
function addItem(event) {
    event.preventDefault();

    const itemName = document.getElementById("itemName").value;
    const itemQuantity = parseFloat(document.getElementById("itemQuantity").value);
    const itemPrice = parseFloat(document.getElementById("itemPrice").value);

    if (itemQuantity <= 0 || itemPrice <= 0) {
        alert("Quantity and price must be greater than zero!");
        return;
    }

    receiptItems.push({
        name: itemName,
        quantity: itemQuantity,
        unitPrice: itemPrice
    });

    updateLocalStorage();
    generateReceipt(receiptItems);
    document.getElementById("addItemForm").reset(); // Resetuj formularz
}

// Funkcja edytująca istniejący element
function editItem(index) {
    const item = receiptItems[index];

    document.getElementById("editItemName").value = item.name;
    document.getElementById("editItemQuantity").value = item.quantity;
    document.getElementById("editItemPrice").value = item.unitPrice;

    currentEditIndex = index;

    // Otwórz dialog
    document.getElementById("editDialog").showModal();
}

// Funkcja zapisująca zmiany w edytowanym elemencie
function saveEdit(event) {
    event.preventDefault();

    const editedName = document.getElementById("editItemName").value;
    const editedQuantity = parseFloat(document.getElementById("editItemQuantity").value);
    const editedPrice = parseFloat(document.getElementById("editItemPrice").value);

    if (editedQuantity <= 0 || editedPrice <= 0) {
        alert("Quantity and price must be greater than zero!");
        return;
    }

    receiptItems[currentEditIndex] = {
        name: editedName,
        quantity: editedQuantity,
        unitPrice: editedPrice
    };

    updateLocalStorage();
    generateReceipt(receiptItems);
    document.getElementById("editDialog").close(); // Zamknij dialog
}

// Funkcja anulująca edycję
function cancelEdit() {
    document.getElementById("editDialog").close(); // Zamknij dialog
}

// Funkcja wyświetlająca dialog usuwania
function showDeleteDialog(index) {
    const deleteDialog = document.getElementById("deleteDialog");
    deleteDialog.showModal();

    // Obsługa potwierdzenia usunięcia
    document.getElementById("confirmDeleteBtn").onclick = function() {
        deleteItem(index);
        deleteDialog.close();
    };

    // Obsługa anulowania usunięcia
    document.getElementById("cancelDeleteBtn").onclick = function() {
        deleteDialog.close();
    };
}

// Funkcja usuwająca element
function deleteItem(index) {
    receiptItems.splice(index, 1);
    updateLocalStorage();
    generateReceipt(receiptItems);
}

// Funkcja aktualizująca dane w localStorage
function updateLocalStorage() {
    localStorage.setItem("receiptItems", JSON.stringify(receiptItems));
}

// Inicjalizacja
document.getElementById("addItemForm").addEventListener("submit", addItem);
document.getElementById("editForm").addEventListener("submit", saveEdit);
document.getElementById("cancelEditBtn").addEventListener("click", cancelEdit);
window.addEventListener("load", () => generateReceipt(receiptItems));
