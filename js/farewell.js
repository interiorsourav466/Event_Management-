document.addEventListener('DOMContentLoaded', function() {
    let contributions = [];
    let totalNeeded = 50000;
    let totalCollected = 0;

    document.getElementById('fareSubmitButton').addEventListener('click', function() {
        document.getElementById('FarewellContributionForm').dispatchEvent(new Event('submit'));
    });

    document.getElementById('FarewellContributionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let name = document.getElementById('name').value.trim();
        let amount = parseFloat(document.getElementById('amount').value.trim());

        if (!name) {
            document.getElementById('nameError').style.display = 'block';
            return;
        } else {
            document.getElementById('nameError').style.display = 'none';
        }

        if (!amount || amount <= 0) {
            document.getElementById('amountError').style.display = 'block';
            return;
        } else {
            document.getElementById('amountError').style.display = 'none';
        }

        contributions.push({ name, amount });
        totalCollected += amount;

        updateContributionList();
        updateProgressBar();
        updateTotals();

        document.getElementById('FarewellContributionForm').reset();
    });

    function updateContributionList() {
        let contributionList = document.getElementById('fareContributionList');
        contributionList.innerHTML = '';
        contributions.forEach(contribution => {
            let listItem = document.createElement('div');
            listItem.className = 'contribution-item';
            listItem.innerHTML = `<p><strong>${contribution.name}</strong>: ₹${contribution.amount}</p>`;
            contributionList.appendChild(listItem);
        });
    }

    function updateProgressBar() {
        let progressBar = document.getElementById('progressBar');
        let progressPercentage = (totalCollected / totalNeeded) * 100;
        progressBar.style.width = progressPercentage + '%';
    }

    function updateTotals() {
        document.getElementById('totalCollected').innerText = totalCollected;
        document.getElementById('remainingAmount').innerText = totalNeeded - totalCollected;
    }

    document.getElementById('viewSummaryBtn').addEventListener('click', function() {
        document.querySelector('.farewellCard').style.display = 'none';
        document.getElementById('eventPage').style.display = 'block';
        document.getElementById('eventTotalCollected').innerText = totalCollected;
        document.getElementById('totalSpent').innerText = Math.min(50000, totalCollected);
    });

    // Handle Add Feedback button
    // Handle Add Feedback button
    document.getElementById('addFeedbackButton').addEventListener('click', function() {
        let feedbackInput = document.getElementById('feedbackInput');
        let feedbackValue = feedbackInput.value.trim();

        if (feedbackValue) {
            let feedbackList = document.getElementById('feedbackList');
            let listItem = document.createElement('li');
            listItem.textContent = feedbackValue;
            feedbackList.appendChild(listItem);

            let feedbackMessage = document.getElementById('feedbackMessage');
            feedbackMessage.textContent = `"${feedbackValue}" has been added.`;
            feedbackMessage.style.display = 'block';

            // Clear the input field
            feedbackInput.value = '';

            // Reset feedback message after a short delay
            setTimeout(() => {
                feedbackMessage.style.display = 'none';
            }, 3000); // Hides the message after 3 seconds
        } else {
            // Hide the feedback message if input is empty
            document.getElementById('feedbackMessage').style.display = 'none';
        }
    });



});

function goBack() {
    document.getElementById('eventPage').style.display = 'none';
    document.querySelector('.farewellCard').style.display = 'block';
}