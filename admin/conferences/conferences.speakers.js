// References to HTML objects
const tblSpeakers = document.getElementById("tblSpeakers");
const tabSpeakers = document.getElementById("nav-speakers-tab");

const renderSpeakers = async (idConference, conferenceName, urlBase) => {

    let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='4'>Lista de Oradores da Conferência ${conferenceName}</th></tr>
                <tr class='bg-info'>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Cargo</th>              
                    <th class="text-right">Participa</th>              
                </tr> 
            </thead><tbody>
        `;

    const response = await fetch(`${urlBase}/speakers/conference/${idConference}`);
    const speakers = await response.json();

    let i = 1;
    for (const speaker of speakers) {
        let checked = '';
        if (speaker.conferences.length > 0) {
            checked = 'checked="checked"';
        }

        strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${speaker.nome}</td>
                    <td>${speaker.cargo}</td>
                    <td class="text-right">
                        <input type="checkbox" id='speaker-${speaker.idSpeaker}' idspeaker='${speaker.idSpeaker}' ${checked} class='speaker-goes'>
                    </td>
                </tr>
            `;
        i++;
    }
    strHtml += "</tbody>";
    tblSpeakers.innerHTML = strHtml;

    // Gerir a participação do orador
    const chkSpeakerGoes = document.getElementsByClassName("speaker-goes");
    for (let i = 0; i < chkSpeakerGoes.length; i++) {
        chkSpeakerGoes[i].addEventListener("click", function () {
            let idSpeaker = this.getAttribute('idspeaker');

            // Add / remove speaker from the conference
            if (this.checked) {
                fetch(`${urlBase}/conferences/${idConference}/speakers/${idSpeaker}`, {
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
                fetch(`${urlBase}/conferences/${idConference}/speakers/${idSpeaker}`, {
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
    tabSpeakers.classList.remove('invisible');
    tabSpeakers.classList.add('visible');
}

function hideTab() {
    // Hide tasks tab link
    tabSpeakers.classList.add('invisible');
    tabSpeakers.classList.remove('visible');
}

export { renderSpeakers, showTab, hideTab };
