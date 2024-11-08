let membersData = [];
let vegCount = 0;
let nonVegCount = 0;

document.getElementById('infoForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Capture form data
    let name = document.getElementById('name1').value;
    let age = document.getElementById('age1').value; // Changed to 'age'
    let gender = document.getElementById('gender').value;
    let foodPreference = document.querySelector('input[name="foodPreference"]:checked').value;

    // Push form data to membersData array
    membersData.push({ name, age, gender, foodPreference });

    // Update counts for veg/non-veg
    if (foodPreference === 'Veg') {
        vegCount++;
    } else if (foodPreference === 'Non-Veg') {
        nonVegCount++;
    }

    // Update totals on the page
    document.getElementById('TotalMember').innerText = membersData.length;
    document.getElementById('VegetarianPeople').innerText = vegCount;
    document.getElementById('NonVegetarianPeople').innerText = nonVegCount;

    // Clear the form after submission
    document.getElementById('infoForm').reset();
});

// Function to generate and download Excel file with two sheets
function generateExcel() {
    // Sheet 1: Form data
    let sheet1 = [
        ["Name", "Age", "Gender", "Food Preference"]
    ]; // Header
    membersData.forEach(member => {
        sheet1.push([member.name, member.age, member.gender, member.foodPreference]);
    });

    // Sheet 2: Summary data
    let sheet2 = [
        ["Total Members", "Vegetarian", "Non-Vegetarian"],
        [membersData.length, vegCount, nonVegCount]
    ];

    // Create a workbook with two sheets
    let wb = XLSX.utils.book_new();
    let ws1 = XLSX.utils.aoa_to_sheet(sheet1); // Convert sheet1 array to Excel format
    let ws2 = XLSX.utils.aoa_to_sheet(sheet2); // Convert sheet2 array to Excel format

    // Append sheets to the workbook
    XLSX.utils.book_append_sheet(wb, ws1, "Member Data");
    XLSX.utils.book_append_sheet(wb, ws2, "Summary");

    // Generate Excel file and download
    XLSX.writeFile(wb, "member_data.xlsx");
}

// Attach event listener to the Excel download button
document.getElementById('CSVDownloadCsvButton').addEventListener('click', generateExcel);