const urlBase = "https://mtsiw.duckdns.org/pwa";

import { renderSpeakers, hideTab as hideSpeakersTab } from './conferences.speakers.js';
import { renderSponsors, hideTab as hideSponsorsTab } from './conferences.sponsors.js';
import { renderCommittee, hideTab as hideCommitteeTab } from './conferences.committee.js';
import { renderTasks, hideTab as hideTasksTab } from './conferences.tasks.js';
import { renderParticipants, hideTab as hideParticipantsTab } from './conferences.participants.js';

const bootConferences = async () => {
    let isNew = true;

    // References to HTML objects
    const tblConferences = document.getElementById("tblConferences");
    const tabConference = document.getElementById("nav-conference-tab");

    const frmConference = document.getElementById("frmConference");

    frmConference.addEventListener("reset", async (event) => {
        isNew = true;

        hideSpeakersTab();
        hideSponsorsTab()
        hideCommitteeTab();
        hideTasksTab();
        hideParticipantsTab();
    });

    frmConference.addEventListener("submit", async (event) => {
        event.preventDefault();
        const txtNome = document.getElementById("txtNome").value;
        const txtAcronimo = document.getElementById("txtAcronimo").value;
        const txtDescricao = document.getElementById("txtDescricao").value;
        const txtLocal = document.getElementById("txtLocal").value;
        const txtData = document.getElementById("txtData").value;
        const txtConferenceId = document.getElementById("txtConferenceId").value;

        try {
            // Verifica flag isNew para saber se se trata de uma adição ou
            // de uma atualização dos dados de uma conferência
            let response;
            let msgBody = `idConference=${txtConferenceId}&nome=${txtNome}&acronimo=${txtAcronimo}&descricao=${txtDescricao}&local=${txtLocal}&data=${txtData}`;
            if (isNew) {
                // Adiciona Conferência
                response = await fetch(`${urlBase}/conferences`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    body: msgBody
                });
            } else {
                // Atualiza Conferência
                response = await fetch(`${urlBase}/conferences/${txtConferenceId}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "PUT",
                    body: msgBody
                });
            }

            let result = await response.json();

            if (result.success == true) {
                frmConference.reset();

                Swal.fire({
                    title: 'Sucesso',
                    text: result.message.pt,
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Fechar'
                });
            } else {
                Swal.fire({
                    title: 'Erro',
                    text: result.message.pt,
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Fechar'
                });
            }
        } catch (err) {
            Swal.fire({
                title: 'Erro!',
                text: err,
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Fechar'
            });
        }

        renderConferences();
    })

    const renderConferences = async () => {
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='6'>Lista de Conferências</th></tr>
                <tr class='bg-info'>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Acrónimo</th>
                    <th>Local</th>
                    <th>Data</th>
                    <th class="text-right">Ações</th>
                </tr> 
            </thead><tbody>
        `;
        const response = await fetch(`${urlBase}/conferences`);
        const conferences = await response.json();
        let i = 1
        for (const conference of conferences) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${conference.nome}</td>
                    <td>${conference.acronimo}</td>
                    <td>${conference.local}</td>
                    <td>${conference.data}</td>
                    <td class="text-right">
                        <i id='edit-conference-${conference.idConference}' idconference='${conference.idConference}' class='fas fa-edit edit-conference as-button'></i>
                        <i id='remove-conference-${conference.idConference}' idconference='${conference.idConference}' class='fas fa-trash-alt remove-conference as-button'></i>
                    </td>
                </tr>
            `;
            i++;
        }
        strHtml += "</tbody>";
        tblConferences.innerHTML = strHtml;

        // Gerir o clique no ícone de Editar        
        const btnEdit = document.getElementsByClassName("edit-conference")
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", function () {
                isNew = false;
                let idConference = this.getAttribute('idconference');
                for (const conference of conferences) {
                    if (conference.idConference == idConference) {
                        document.getElementById("txtConferenceId").value = conference.idConference;
                        document.getElementById("txtNome").value = validator.unescape(conference.nome);
                        document.getElementById("txtAcronimo").value = validator.unescape(conference.acronimo);
                        document.getElementById("txtDescricao").value = validator.unescape(conference.descricao);
                        document.getElementById("txtLocal").value = validator.unescape(conference.local);
                        document.getElementById("txtData").value = conference.data;

                        renderSpeakers(idConference, conference.nome, urlBase);
                        renderSponsors(idConference, conference.nome, urlBase);
                        renderCommittee(idConference, conference.nome, urlBase);
                        renderTasks(idConference, conference.nome, urlBase);
                        renderParticipants(idConference, conference.nome, urlBase);
                    }
                }
            });
        }

        // Gerir o clique no ícone de Remover        
        const btnDelete = document.getElementsByClassName("remove-conference")
        for (let i = 0; i < btnDelete.length; i++) {
            btnDelete[i].addEventListener("click", function () {
                let idConference = this.getAttribute("idconference");

                Swal.fire({
                    title: 'Tem a certeza?',
                    text: "Não será possível reverter a remoção!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Remover'
                }).then(async (result) => {
                    if (result.value) {
                        try {
                            const response = await fetch(`${urlBase}/conferences/${idConference}`, {
                                method: "DELETE"
                            });

                            const result = await response.json();

                            if (result.success == true) {
                                Swal.fire({
                                    title: 'Sucesso',
                                    text: result.message.pt,
                                    icon: 'success',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: 'Fechar'
                                });
                            } else {
                                Swal.fire({
                                    title: 'Erro',
                                    text: result.message.pt,
                                    icon: 'error',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: 'Fechar'
                                });
                            }
                        } catch (err) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Erro',
                                text: err,
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'Fechar'

                            });
                        }
                        renderConferences();
                    }
                });
            });
        }
    }

    frmConference.reset();
    renderConferences();
}

export { bootConferences as default };