document.getElementById('komentarForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const komentar = document.getElementById('inputField').value;
    const checkbox = document.getElementById('check1');
    if (checkbox.checked) {
        try {
            const response = await fetch('/submitKomentar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ komentar })
            });
    
            if (response.ok) {
                console.log('Komentar uspješno poslan');
                const komentar = await response.json();
                prikaziKomentar(komentar);
            } else {
                const errorData = await response.json();
                alert('Greška prilikom slanja komentara: ' + errorData.error);
            }
        } catch (error) {
            console.error('Greška:', error);
        }
    } else {
        try {
            const response = await fetch('/submitKomentarIsklj', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ komentar })
            });
    
            if (response.ok) {
                console.log('Komentar uspješno poslan');
                const komentar = await response.json();
                prikaziKomentar(komentar);
            } else {
                const errorData = await response.json();
                alert('Greška prilikom slanja komentara: ' + errorData.error);
            }
        } catch (error) {
            console.error('Greška:', error);
        }
    }
});

document.getElementById('karticaForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const kartica = document.getElementById('cardInput').value;
    const checkbox = document.getElementById('check2');
    if (checkbox.checked) {
        try {
            const response = await fetch('/submitKartica', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ kartica })
            });
    
            if (response.ok) {
                console.log('Broj kartice uspješno poslan');
                const kart = await response.json();
                prikaziKarticu(kart);
            } else {
                const errorData = await response.json();
                alert('Greška prilikom slanja broja kartice: ' + errorData.error);
            }
        } catch (error) {
            console.error('Greška:', error);
        }
    } else {
        try {
            const response = await fetch('/submitKarticaIsklj', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ kartica })
            });
    
            if (response.ok) {
                console.log('Broj kartice uspješno poslan');
                const kart = await response.json();
                prikaziKarticu(kart);
            } else {
                const errorData = await response.json();
                alert('Greška prilikom slanja broja kartice: ' + errorData.error);
            }
        } catch (error) {
            console.error('Greška:', error);
        }
    }
});

function prikaziKomentar(komentar) {
    const tableBody = document.getElementById('tableBody1');
    const komentarRow = document.createElement('tr');
    komentarRow.innerHTML = `
            <td>${komentar.tekst}</td>
        `;
    tableBody.appendChild(komentarRow);
    const tableContainer = document.querySelector('.table-container');
    tableContainer.scrollTop = tableContainer.scrollHeight;
}

function prikaziKomentare(komentari) {
    const tableBody = document.getElementById('tableBody1');
    tableBody.innerHTML = '';
    komentari.forEach(komentar => {
        const komentarRow = document.createElement('tr');
        komentarRow.innerHTML = `
            <td>${komentar.tekst}</td>
        `;
        tableBody.appendChild(komentarRow);
    });
    const tableContainer = document.querySelector('.table-container');
    tableContainer.scrollTop = tableContainer.scrollHeight;
}

function prikaziKarticu(kartica) {
    const div = document.getElementById('desifrirano');
    div.style.display='none';
    document.getElementById('vidljiv').style.display = 'block';
    const tableBody = document.getElementById('tableBody2');
    tableBody.innerHTML = '';
    const komentarRow = document.createElement('tr');
    komentarRow.innerHTML = `
            <td>${kartica.id}</td>
            <td>${kartica.brojkartice}</td>
        `;
    tableBody.appendChild(komentarRow);
    if (kartica.desifrirano){
        div.style.display = 'block';
        div.innerHTML = 'Dešifrirani zapis: ' + kartica.desifrirano
    }
}

window.onload = tablica;
async function tablica() {
    try {
        const response = await fetch('/tablica');
        if (response.ok) {
            const komentari = await response.json();
            prikaziKomentare(komentari);
        } else {
            console.error('Greška prilikom dohvaćanja komentara:', response.statusText);
        }
    } catch (error) {
        console.error('Greška:', error);
    }
}