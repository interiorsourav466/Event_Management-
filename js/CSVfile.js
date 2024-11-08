document.addEventListener("DOMContentLoaded", function() {
    let totalCollected = 0;
    const budget = 100000;
    let contributions = [];
    let editIndex = -1;

    document.getElementById("contributionForm").addEventListener("submit", function(event) {
        event.preventDefault();

        let name = document.getElementById("name").value;
        let amount = parseFloat(document.getElementById("amount").value);

        if (editIndex === -1) {
            // Add a new contribution
            contributions.push({ name, amount });
            totalCollected += amount;
        } else {
            // Update existing contribution
            totalCollected -= contributions[editIndex].amount;
            contributions[editIndex] = { name, amount };
            totalCollected += amount;
            editIndex = -1;
        }

        // Reset form fields
        document.getElementById("name").value = '';
        document.getElementById("amount").value = '';
        document.getElementById("cancelEdit").style.display = 'none';

        updateContributionList();
        document.getElementById("totalCollected").textContent = totalCollected;

        compareWithBudget(totalCollected, budget);
    });

    function compareWithBudget(collected, budget) {
        let resultMessage = document.getElementById("resultMessage");
        if (collected >= budget) {
            resultMessage.textContent = "You have reached the budget goal!";
            resultMessage.style.color = "green";
        } else {
            let remaining = budget - collected;
            resultMessage.textContent = `You still need ₹${remaining} to reach the budget.`;
            resultMessage.style.color = "red";
        }
    }

    function updateContributionList() {
        let contributionList = document.getElementById("contributionList");
        contributionList.innerHTML = '';

        contributions.forEach((contribution, index) => {
            let listItem = document.createElement("li");
            listItem.innerHTML = `${contribution.name} contributed ₹${contribution.amount} 
                <button onclick="editContribution(${index})">Edit</button>`;
            contributionList.appendChild(listItem);
        });
    }

    window.editContribution = function(index) {
        let contribution = contributions[index];
        document.getElementById("name").value = contribution.name;
        document.getElementById("amount").value = contribution.amount;
        editIndex = index;
        document.getElementById("cancelEdit").style.display = 'inline';
    };

    document.getElementById("cancelEdit").addEventListener("click", function() {
        document.getElementById("name").value = '';
        document.getElementById("amount").value = '';
        editIndex = -1;
        this.style.display = 'none';
    });

    document.getElementById("downloadCSV").addEventListener("click", function() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Name,Amount\n";

        contributions.forEach(function(row) {
            csvContent += `${row.name},${row.amount}\n`;
        });

        let excelURI = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", excelURI);
        link.setAttribute("download", "Contribution.csv");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});