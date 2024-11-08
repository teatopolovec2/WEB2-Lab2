document.getElementById('komentarForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const komentar = document.getElementById('inputField').value;
    const checkbox = document.getElementById('check1');
    if (checkbox.checked) { //objava komentara, ranjivost uključena
        try {
            const response = await fetch('/submitKomentar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ komentar })
            });
    
            if (response.ok) {
                const komentar = await response.json(); 
                document.getElementById('komentarForm').reset();
                prikaziKomentar(komentar);//prikaz komentara na stranici
            } else {
                const errorData = await response.json();
                alert('Greška prilikom slanja komentara: ' + errorData.error);
            }
        } catch (error) {
            console.error('Greška:', error);
        }
    } else {
        try {
            const response = await fetch('/submitKomentarIsklj', { //objava komentara, ranjivost isključena
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ komentar })
            });
    
            if (response.ok) {
                const komentar = await response.json();
                document.getElementById('komentarForm').reset();
                prikaziKomentar(komentar);//prikaz komentara na stranici
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
            const response = await fetch('/submitKartica', { //unos broja kartice, ranjivost uključena
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ kartica })
            });
    
            if (response.ok) {
                const kart = await response.json();
                prikaziKarticu(kart); //prikaz zapisa spremljenog u bazu
            } else {
                const errorData = await response.json();
                alert('Greška prilikom slanja broja kartice: ' + errorData.error);
            }
        } catch (error) {
            console.error('Greška:', error);
        }
    } else {
        try {
            const response = await fetch('/submitKarticaIsklj', { //unos broja kartice, ranjivost isključena
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ kartica })
            });
    
            if (response.ok) {
                const kart = await response.json();
                prikaziKarticu(kart); //prikaz zapisa spremljenog u bazu
            } else {
                const errorData = await response.json();
                alert('Greška prilikom slanja broja kartice: ' + errorData.error);
            }
        } catch (error) {
            console.error('Greška:', error);
        }
    }
});

function prikaziKomentar(komentar) { //prikaz novoobjavljenog komentara na stranici
    const tableBody = document.getElementById('tableBody1');
    const komentarRow = document.createElement('tr');
    komentarRow.innerHTML = `
            <td>${komentar.tekst}</td>
        `;
    tableBody.appendChild(komentarRow);
    const tableContainer = document.querySelector('.table-container');
    tableContainer.scrollTop = tableContainer.scrollHeight;
}

function prikaziKomentare(komentari) { //prikaz svih komentara prilikom ucitavanja stranice
    const tableBody = document.getElementById('tableBody1');
    tableBody.innerHTML = '';
    komentari.forEach(komentar => {
        const komentarRow = document.createElement('tr');
        komentarRow.innerHTML = `
            <td>${komentar.tekst}</td>
        `;
        tableBody.appendChild(komentarRow);
    });
}

function prikaziKarticu(kartica) {  //prikaz zapisa broja kartice spremljenog u bazu
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
    if (kartica.desifrirano){   //ako je dostupan prikazi i desifrirani zapis
        div.style.display = 'block';
        div.innerHTML = 'Dešifrirani zapis: ' + kartica.desifrirano
    }
}

window.onload = tablica;
async function tablica() {  //dohvat svih komentara dosad objavljenih
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
