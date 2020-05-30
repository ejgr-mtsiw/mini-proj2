// References to HTML objects
const tblSponsors = document.getElementById("tblSponsors");
const tabSponsors = document.getElementById("nav-sponsors-tab");

const renderSponsors = async (idConference, conferenceName, urlBase) => {

    let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='4'>Lista de Sponsors da Conferência ${conferenceName}</th></tr>
                <tr class='bg-info'>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Categoria</th>              
                    <th class="text-right">Participa</th>              
                </tr> 
            </thead><tbody>
        `;

    const response = await fetch(`${urlBase}/sponsors/conference/${idConference}`);
    const sponsors = await response.json();

    let i = 1;
    for (const sponsor of sponsors) {
        let checked = '';
        if (sponsor.conferences.length > 0) {
            checked = 'checked="checked"';
        }

        strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${sponsor.nome}</td>
                    <td>${sponsor.categoria}</td>
                    <td class="text-right">
                        <input type="checkbox" id='speaker-${sponsor.idSponsor}' idsponsor='${sponsor.idSponsor}' ${checked} class='sponsor-goes'>
                    </td>
                </tr>
            `;
        i++;
    }
    strHtml += "</tbody>";
    tblSponsors.innerHTML = strHtml;

    // Gerir a participação do orador
    const chkSponsorGoes = document.getElementsByClassName("sponsor-goes");
    for (let i = 0; i < chkSponsorGoes.length; i++) {
        chkSponsorGoes[i].addEventListener("click", function () {
            let idSponsor = this.getAttribute('idsponsor');

            // Add / remove sponsor from the conference
            if (this.checked) {
                fetch(`${urlBase}/conferences/${idConference}/sponsors/${idSponsor}`, {
                    method: "PUT"
                }).catch((error) => {
                    Swal.fire({
                        title: 'Erro!',
                        text: error,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Fechar'
                    });
                });
            } else {
                fetch(`${urlBase}/conferences/${idConference}/sponsors/${idSponsor}`, {
                    method: "DELETE"
                }).catch((error) => {
                    Swal.fire({
                        title: 'Erro!',
                        text: error,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Fechar'
                    });
                });
            }
        });
    }

    showTab();
}

function showTab() {
    // Show tasks tab link
    tabSponsors.classList.remove('invisible');
    tabSponsors.classList.add('visible');
}

function hideTab() {
    // Hide tasks tab link
    tabSponsors.classList.add('invisible');
    tabSponsors.classList.remove('visible');
}

export { renderSponsors, showTab, hideTab };
