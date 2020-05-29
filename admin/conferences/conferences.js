const urlBase = "https://mtsiw.duckdns.org/pwa";
let isNew = true, isNewTask = true;

function formatDate(dateString) {
    let d = new Date(Date.parse(dateString));

    return d.getDay() + '-' + d.getMonth() + '-' + d.getFullYear() + ' ' +
        d.getHours() + ':' + d.getMinutes();
}

window.onload = () => {
    // References to HTML objects
    const tblConferences = document.getElementById("tblConferences");
    const tblSpeakers = document.getElementById("tblSpeakers");
    const tblSponsors = document.getElementById("tblSponsors");
    const tblCommittee = document.getElementById("tblCommittee");
    const tblTasks = document.getElementById("tblTasks");
    const tblParticipants = document.getElementById("tblParticipants");

    const tabConference = document.getElementById("nav-conference-tab");
    const tabSpeakers = document.getElementById("nav-speakers-tab");
    const tabSponsors = document.getElementById("nav-sponsors-tab");
    const tabCommittee = document.getElementById("nav-committee-tab");
    const tabTasks = document.getElementById("nav-tasks-tab");
    const tabParticipants = document.getElementById("nav-participants-tab");

    const frmConference = document.getElementById("frmConference");

    frmConference.addEventListener("reset", async (event) => {
        isNew = true;

        // Hide speakers tab link
        tabSpeakers.classList.add('invisible');
        tabSpeakers.classList.remove('visible');

        // Hide sponsors tab link
        tabSponsors.classList.add('invisible');
        tabSponsors.classList.remove('visible');

        // Hide committee tab link
        tabCommittee.classList.add('invisible');
        tabCommittee.classList.remove('visible');

        // Hide participants tab link
        tabTasks.classList.add('invisible');
        tabTasks.classList.remove('visible');

        // Hide participants tab link
        tabParticipants.classList.add('invisible');
        tabParticipants.classList.remove('visible');
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
                        document.getElementById("txtConferenceId").value = conference.idConference
                        document.getElementById("txtNome").value = conference.nome
                        document.getElementById("txtAcronimo").value = conference.acronimo
                        document.getElementById("txtDescricao").value = conference.descricao
                        document.getElementById("txtLocal").value = conference.local
                        document.getElementById("txtData").value = conference.data

                        renderSpeakers(idConference, conference.nome);
                        renderSponsors(idConference, conference.nome);
                        renderCommittee(idConference, conference.nome);
                        renderTasks(idConference, conference.nome);
                        renderParticipants(idConference, conference.nome);
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

    const renderSpeakers = async function (idConference, conferenceName) {
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

        // Show speakers tab link
        tabSpeakers.classList.add('visible');
        tabSpeakers.classList.remove('invisible');

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
    };

    const renderSponsors = async function (idConference, conferenceName) {
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

        // Show sponsors tab link
        tabSponsors.classList.add('visible');
        tabSponsors.classList.remove('invisible');

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
    };

    const renderCommittee = async function (idConference, conferenceName) {
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='5'>Membros do Comité Científico da Conferência ${conferenceName}</th></tr>
                <tr class='bg-info'>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Instituição</th>
                    <th class="text-right">Participa</th>              
                </tr> 
            </thead><tbody>
        `;
        const response = await fetch(`${urlBase}/committee/conference/${idConference}`);
        const members = await response.json();
        let i = 1;
        for (const member of members) {
            let checked = '';
            if (member.conferences && member.conferences.length > 0) {
                checked = 'checked="checked"';
            }

            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${member.nome}</td>
                    <td>${member.email}</td>
                    <td>${member.instituicao}</td>
                    <td class="text-right">
                        <input type="checkbox" id='committeemember-${member.idCommitteeMember}' idcommitteemember='${member.idCommitteeMember}' ${checked} class='member-goes'>
                    </td>
                </tr>
            `;
            i++;
        }
        strHtml += "</tbody>";
        tblCommittee.innerHTML = strHtml;

        // Show speakers tab link
        tabCommittee.classList.add('visible');
        tabCommittee.classList.remove('invisible');

        // Gerir a participação do orador
        const chkMemberGoes = document.getElementsByClassName("member-goes");
        for (let i = 0; i < chkMemberGoes.length; i++) {
            chkMemberGoes[i].addEventListener("click", function () {
                let idCommitteeMember = this.getAttribute('idcommitteemember');

                // Add / remove speaker from the conference
                if (this.checked) {
                    fetch(`${urlBase}/conferences/${idConference}/committee/${idCommitteeMember}`, {
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
                    fetch(`${urlBase}/conferences/${idConference}/committee/${idCommitteeMember}`, {
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
    };

    const renderTasks = async function (idConference, conferenceName) {

        let response = await fetch(`${urlBase}/conferences/${idConference}/tasks`);
        const tasks = await response.json();

        response = await fetch(`${urlBase}/volunteers/`);
        const volunteers = await response.json();

        let nColunas = 4 + volunteers.length;

        let strHtml = `
        <table class="table table-sm">
        <thead >
            <tr><th class='w-100 text-center bg-warning' colspan='${nColunas}'>Tarefas da Conferência ${conferenceName}</th></tr>
            <tr class='bg-info'>
                <th>#</th>
                <th>Tarefa</th>
                <th>Início</th>
                <th>Fim</th>`;

        for (const volunteer of volunteers) {
            strHtml += `<th class="col-1">${volunteer.nome}</th>`;
        }

        strHtml += "</tr></thead><tbody>";

        let i = 1;
        for (const task of tasks) {

            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${task.nome}</td>
                    <td>${formatDate(task.inicio)}</td>
                    <td>${formatDate(task.fim)}</td>`;

            volunteers.forEach((volunteer) => {

                let checked = '';

                if (task.volunteers) {
                    for (const taskVolunteer of task.volunteers) {
                        if (taskVolunteer.idVolunteer == volunteer.idVolunteer) {
                            checked = 'checked="checked"';
                            break;
                        }
                    }
                }

                strHtml += `<td class="text-center"><input type="checkbox"` +
                    ` id="task-${task.idTask}-${volunteer.idVolunteer}"` +
                    ` idtask="${task.idTask}" idvolunteer="${volunteer.idVolunteer}"` +
                    ` ${checked} class="volunteer-does-task" ></td>`;
            });

            strHtml += "</tr>";
            i++;
        }

        strHtml += `</tbody></table>
        <div class="container">
        <form id="frmTask">
            <input type="hidden" id="txtTaskId">

            <div class="row">
                <div class="form-group col">
                <label for="txtTaskNome">Nome</label>
                <input type="text" placeholder="Nome" class="form-control" id="txtTaskNome" required>
                </div>
                <div class="form-group col col-md-2">
                <label for="txtTaskInicio">Início</label>
                <input type="text" class="form-control" id="txtTaskInicio" required>
                </div>
                <div class="form-group col-md-2">
                <label for="txtTaskFim">Fim</label>
                <input type="text" class="form-control" id="txtTaskFim" required>
                </div>
            </div>

            <!-- Buttons-->
            <div class="form-row">
                <div class="form-group col-md-12">
                <button type="submit" class="btn btn-primary mb-2">Adicionar tarefa à conferência</button>
                <button type="reset" class="btn btn-primary mb-2">Limpar valores</button>
                </div>
            </div>
            </form>
        </div>
        `;
        tblTasks.innerHTML = strHtml;

        // Add tarefa
        const frmTask = document.getElementById("frmTask");

        frmTask.addEventListener("reset", async (event) => {
            isNewTask = true;
        });

        frmTask.addEventListener("submit", async (event) => {
            event.preventDefault();

            let idTask = document.getElementById("txtTaskId").value;
            let nome = document.getElementById("txtTaskNome").value;
            let inicio = document.getElementById("txtTaskInicio").value;
            let fim = document.getElementById("txtTaskFim").value;

            try {
                // Verifica flag isNew para saber se se trata de uma adição ou
                // de uma atualização dos dados de uma conferência
                let response;
                let msgBody = `idConference=${idConference}&nome=${nome}&inicio=${inicio}&fim=${fim}`;
                if (isNewTask) {
                    // Adiciona Tarefa
                    response = await fetch(`${urlBase}/tasks`, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: "POST",
                        body: msgBody
                    });
                } else {
                    // Atualiza Tarefa
                    response = await fetch(`${urlBase}/tasks/${idTask}`, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: "PUT",
                        body: msgBody
                    });
                }

                let result = await response.json();

                if (result.success == true) {
                    frmTask.reset();

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

            renderTasks(idConference, conferenceName);
        });

        // Gerir a participação do voluntário
        const chkVolunteerDoesTask = document.getElementsByClassName("volunteer-does-task");
        for (let i = 0; i < chkVolunteerDoesTask.length; i++) {
            chkVolunteerDoesTask[i].addEventListener("click", function () {
                let idVolunteer = this.getAttribute('idvolunteer');
                let idTask = this.getAttribute('idtask');

                // Update task
                if (this.checked) {
                    fetch(`${urlBase}/conferences/${idConference}/tasks/${idTask}/volunteers/${idVolunteer}`, {
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
                    fetch(`${urlBase}/conferences/${idConference}/tasks/${idTask}/volunteers/${idVolunteer}`, {
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

        // Show tasks tab link
        tabTasks.classList.add('visible');
        tabTasks.classList.remove('invisible');
    };

    const renderParticipants = async (idConference, conferenceName) => {
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='4'>Lista de Participantes da Conferência ${conferenceName}</th></tr>
                <tr class='bg-info'>
                    <th>#</th>
                    <th>Nome</th>
                    <th>E-mail</th>              
                    <th class="text-right">Ações</th>              
                </tr> 
            </thead><tbody>
        `;
        const response = await fetch(`${urlBase}/conferences/${idConference}/participants`);
        const participants = await response.json();
        let i = 1;
        for (const participant of participants) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${participant.nomeParticipante}</td>
                    <td>${participant.idParticipant}</td>
                    <td class="text-right">
                    <i id='remove-participant-${participant.idParticipant}' idparticipant='${participant.idParticipant}' class='fas fa-trash-alt remove-participant as-button'></i>
                    </td>
                </tr>
            `;
            i++;
        }
        strHtml += "</tbody>";
        tblParticipants.innerHTML = strHtml;

        // Show participants tab link
        tabParticipants.classList.add('visible');
        tabParticipants.classList.remove('invisible');

        // Manage click delete        
        const btnDelete = document.getElementsByClassName("remove-participant");
        for (let i = 0; i < btnDelete.length; i++) {
            btnDelete[i].addEventListener("click", function () {
                let participantId = this.getAttribute("idparticipant");

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
                            const response = await fetch(`${urlBase}/conferences/${idConference}/participants/${participantId}`,
                                {
                                    method: "DELETE"
                                }
                            );
                            const result = await response.json();

                            if (result.success == true) {
                                Swal.fire({
                                    title: 'Removido!',
                                    text: "O participante foi removido da Conferência.",
                                    icon: 'success',
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
                        renderParticipants(idConference, conferenceName);
                    }
                });
            });
        }
    };

    frmConference.reset();
    renderConferences();
}