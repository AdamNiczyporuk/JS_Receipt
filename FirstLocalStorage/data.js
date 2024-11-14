// Inicjalizacja paragonu z localStorage
let receiptItems = JSON.parse(localStorage.getItem("receiptItems")) || [];
let currentEditIndex = null;  // Dodajemy zmienną do śledzenia edytowanego elementu

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
                <span class="material-symbols-outlined" style="cursor: pointer;" onclick="deleteItem(${index})">
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

    // Walidacja danych
    if (itemName === "" || isNaN(itemQuantity) || isNaN(itemPrice)) {
        alert("Wszystkie pola muszą być poprawnie wypełnione.");
        return;
    }

    if (currentEditIndex !== null) {
        // Jeśli edytujemy element, to go aktualizujemy
        receiptItems[currentEditIndex] = {
            name: itemName,
            quantity: itemQuantity,
            unitPrice: itemPrice
        };
        currentEditIndex = null; // Resetujemy indeks edytowanego elementu
    } else {
        // Dodajemy nowy element
        receiptItems.push({
            name: itemName,
            quantity: itemQuantity,
            unitPrice: itemPrice
        });
    }

    updateLocalStorage();
    generateReceipt(receiptItems);
    document.getElementById("addItemForm").reset(); // Resetuj formularz
}

// Funkcja edytująca istniejący element
function editItem(index) {
    const item = receiptItems[index];

    // Ustawiamy wartości w formularzu na podstawie elementu, który edytujemy
    document.getElementById("itemName").value = item.name;
    document.getElementById("itemQuantity").value = item.quantity;
    document.getElementById("itemPrice").value = item.unitPrice;

    // Ustawiamy indeks edytowanego elementu
    currentEditIndex = index;
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
