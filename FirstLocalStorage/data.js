// Inicjalizacja paragonu z localStorage
let receiptItems = JSON.parse(localStorage.getItem("receiptItems")) || [];

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
            <span class="material-symbols-outlined"edit</span>
                <button onclick="editItem(${index})">Edit</button>
                <button onclick="deleteItem(${index})">Delete</button>
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

    document.getElementById("itemName").value = item.name;
    document.getElementById("itemQuantity").value = item.quantity;
    document.getElementById("itemPrice").value = item.unitPrice;

    // deleteItem(index); // Usuwamy starą wersję
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
window.addEventListener("load", () => generateReceipt(receiptItems));
