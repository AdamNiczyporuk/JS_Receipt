const receiptItems = [
    { name: "Jabłka", quantity: 1.5, unitPrice: 4.90 },
    { name: "Bułka", quantity: 5, unitPrice: 0.49 }
];

function generateReceipt(items) {
    const tableBody = document.querySelector("#receiptTable tbody");
    let totalAmount = 0;

    items.forEach(item => {
        const totalPrice = item.quantity * item.unitPrice;
        totalAmount += totalPrice;

        // Tworzenie wiersza tabeli
        const row = document.createElement("tr");

        const itemNameCell = document.createElement("td");
        itemNameCell.textContent = item.name;
        row.appendChild(itemNameCell);

        const quantityCell = document.createElement("td");
        quantityCell.textContent = item.quantity;
        row.appendChild(quantityCell);

        const unitPriceCell = document.createElement("td");
        unitPriceCell.textContent = item.unitPrice.toFixed(2) + " zł";
        row.appendChild(unitPriceCell);

        const totalPriceCell = document.createElement("td");
        totalPriceCell.textContent = totalPrice.toFixed(2) + " zł";
        row.appendChild(totalPriceCell);

        tableBody.appendChild(row);
    });

    // Wyświetlenie łącznej kwoty
    document.getElementById("totalAmount").textContent = totalAmount.toFixed(2) + " zł";
}

// Generowanie paragonu na podstawie danych
generateReceipt(receiptItems);