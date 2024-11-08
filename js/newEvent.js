const events = [];

// Function to convert array of objects to CSV
function convertToCSV(contributors) {
    const headers = ['Name', 'Amount', 'Payment Date'];
    const rows = contributors.map(contributor => {
        const formattedDate = new Date(contributor.paymentDate).toISOString().split('T')[0];
        return [contributor.name, contributor.amount, formattedDate];
    });
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    return csvContent;
}

// Function to download CSV
function downloadCSV(event) {
    const csvContent = convertToCSV(event.contributors);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `${event.name}_contributors.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to initialize an event
// Function to initialize an event
// Function to initialize an event
function initializeEvent(event) {
    const tbody = document.querySelector('.table tbody');
    const newRow = document.createElement('tr');
    newRow.style.backgroundColor = '#f9f9f9';

    const totalCollected = event.contributors.reduce((acc, curr) => acc + curr.amount, 0);
    const isHouseholdEvent = event.name === 'Household';

    newRow.innerHTML = `
        <td><input type="text" value="${event.name}" required style="border:none; box-shadow:none; width: 100%; margin-top:0.1px;" ${isHouseholdEvent ? 'disabled' : ''}/></td>
        <td><input type="number" value="${event.budget}" required style="border:none; box-shadow:none; width: 100%; margin-top:0.1px;" ${isHouseholdEvent ? 'disabled' : ''}/></td>
        <td style="text-align:center;"><div class="total-collected" style="margin-top:5px;">${totalCollected}</div></td>
        <td><input type="date" value="${event.deadline}" required style="border:none; box-shadow:none; width: 100%;  height:33px" ${isHouseholdEvent ? 'disabled' : ''}/></td>
        <td><input type="date" value="${event.orgDate}" required style="border:none; box-shadow:none; width: 100%;  height:33px" ${isHouseholdEvent ? 'disabled' : ''}/></td>
        <td><button class="viewBtn" style="background-color: rgb(87, 87, 255); ">View</button></td>
        <td><button class="addContributorBtn" style="background-color: rgb(87, 87, 255); ">Add Contributor</button></td>
    `;

    tbody.appendChild(newRow);

    // Add event listener to the View button
    newRow.querySelector('.viewBtn').addEventListener('click', function() {
        showModal(event, newRow);
    });

    // Add event listener to the Add Contributor button
    newRow.querySelector('.addContributorBtn').addEventListener('click', () => {
        const addContributorModal = new bootstrap.Modal(document.getElementById('addContributorModal'));

        // Clear previous inputs
        document.getElementById('contributorName').value = '';
        document.getElementById('contributorAmount').value = '';
        document.getElementById('paymentDate').value = '';

        // Set up the event listener for adding a contributor
        const submitButton = document.getElementById('submitContributor');
        submitButton.onclick = () => {
            const name = document.getElementById('contributorName').value;
            const amount = parseFloat(document.getElementById('contributorAmount').value);
            const paymentDate = document.getElementById('paymentDate').value;

            if (name && amount && paymentDate) {
                event.contributors.push({ name, amount, paymentDate });
                updateContributorList(event, newRow);
                addContributorModal.hide();
            } else {
                alert("Please fill in all fields.");
            }
        };

        addContributorModal.show();
    });
}

// Function to update the contributor list in the modal
function updateContributorList(event, rowElement) {
    const contributorList = document.getElementById('contributorList');
    contributorList.innerHTML = ''; // Clear previous list
    const totalCollected = event.contributors.reduce((acc, curr) => acc + curr.amount, 0);

    event.contributors.forEach(contributor => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${contributor.name}</td><td>${contributor.amount}</td><td>${contributor.paymentDate}</td>`;
        contributorList.appendChild(row);
    });

    // Update the total collected amount in the table
    rowElement.querySelector('.total-collected').innerText = totalCollected; // Update collected amount in the main table
}



// Function to show modal and handle contributions
function showModal(event, rowElement) {
    const modalBody = document.getElementById('viewModal').querySelector('.modal-body');
    modalBody.innerHTML = ''; // Clear previous data in the modal

    const contributorList = document.createElement('table');
    contributorList.className = 'table';
    contributorList.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Amount (Rs)</th>
                <th>Payment Date</th>
            </tr>
        </thead>
        <tbody id="contributorList">
        </tbody>
    `;

    event.contributors.forEach(contributor => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${contributor.name}</td><td>${contributor.amount}</td><td>${contributor.paymentDate}</td>`;
        contributorList.querySelector('tbody').appendChild(row);
    });

    modalBody.appendChild(contributorList);

    const totalInfo = document.createElement('p');
    const totalCollected = event.contributors.reduce((acc, curr) => acc + curr.amount, 0);
    totalInfo.innerHTML = `<strong>Total Collected:</strong> Rs ${totalCollected}`;
    modalBody.appendChild(totalInfo);

    // Add Download CSV button
    const downloadButton = document.createElement('button');
    downloadButton.className = 'btn btn-primary';
    downloadButton.innerText = 'Download CSV';
    downloadButton.style.marginRight = '10px';
    downloadButton.onclick = () => downloadCSV(event);
    modalBody.appendChild(downloadButton);

    // Add Close Event button
    const closeButton = document.createElement('button');
    closeButton.className = 'btn btn-danger';
    closeButton.innerText = 'Close Event';
    closeButton.onclick = () => {
        disableEventInputs(rowElement);
        const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewModal'));
        viewModal.hide();
    };
    modalBody.appendChild(closeButton);

    const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
    viewModal.show();
}

// Disable input fields for the event
function disableEventInputs(rowElement) {
    Array.from(rowElement.getElementsByTagName('input')).forEach(input => {
        input.disabled = true;
    });
    Array.from(rowElement.getElementsByTagName('button')).forEach(button => {
        button.disabled = true;
    });
}

// Initialize a predefined event
const householdEvent = {
    name: 'Household',
    budget: 8000,
    deadline: '2024-10-05',
    orgDate: '2024-10-07',
    contributors: []
};

// Add the household event to the events array and initialize it
events.push(householdEvent);
initializeEvent(householdEvent);

// Add listener for new event button
document.getElementById('newEventBtn').addEventListener('click', function() {
    const newEvent = {
        name: '',
        budget: 0,
        deadline: '',
        orgDate: '',
        contributors: []
    };
    events.push(newEvent); // Store the new event in the events array
    initializeEvent(newEvent);
});