let isNewTask = true;

// References to HTML objects
const tblTasks = document.getElementById("tblTasks");
const tabTasks = document.getElementById("nav-tasks-tab");

const renderTasks = async (idConference, conferenceName, urlBase) => {

    let response = await fetch(`${urlBase}/conferences/${idConference}/tasks`);
    const tasks = await response.json();

    response = await fetch(`${urlBase}/volunteers/`);
    const volunteers = await response.json();

    let nColunas = 5 + volunteers.length;

    let strHtml = `
        <table class="table table-sm">
        <thead >
            <tr><th class='w-100 text-center bg-warning' colspan='${nColunas}'>Tarefas da Conferência ${conferenceName}</th></tr>
            <tr class='bg-info'>
                <th>#</th>
                <th>Tarefa</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Ações</th>`;

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
                    <td>${formatDate(task.fim)}</td>
                    <td><i id='remove-task-${task.idTask}' idtask='${task.idTask}' class='fas fa-trash-alt remove-task as-button' title="Eliminar tarefa"></i></td>`;

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
                <div class="form-group col col-md-4">
                <label for="txtTaskInicio">Duração</label>
                <input type="hidden" id="txtTaskInicio" value="2020-05-30">
                <input type="hidden" id="txtTaskFim" value="2020-05-30">
                <input class="form-control" type="text" id="daterange" value="2020-05-30 - 2020-05-30" required>
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
            let msgBody = `idConference=${idConference}&nome=${nome}&inicio=${formatDate(inicio)}&fim=${formatDate(fim)}`;
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

        renderTasks(idConference, conferenceName, urlBase);
    });

    // Manage click delete task    
    const btnDeleteTask = document.getElementsByClassName("remove-task");
    for (let i = 0; i < btnDeleteTask.length; i++) {
        btnDeleteTask[i].addEventListener("click", function () {
            let taskId = this.getAttribute("idtask");

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
                        const response = await fetch(`${urlBase}/tasks/${taskId}`,
                            {
                                method: "DELETE"
                            }
                        );
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
                    renderTasks(idConference, conferenceName, urlBase);
                }
            });
        });
    }

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

    prepareDateRange();
    showTab();
}

function showTab() {
    // Show tasks tab link
    tabTasks.classList.remove('invisible');
    tabTasks.classList.add('visible');
}

function hideTab() {
    // Hide tasks tab link
    tabTasks.classList.add('invisible');
    tabTasks.classList.remove('visible');
}

function formatDate(dateString) {
    return moment.utc(dateString).format("YYYY-MM-DD HH:mm");
}

function prepareDateRange() {
    $("#daterange").daterangepicker({
        timePicker: true,
        timePicker24Hour: true,
        locale: {
            format: "YYYY-MM-DD HH:mm",
            separator: " - ",
            applyLabel: "Aplicar",
            cancelLabel: "Cancelar",
            fromLabel: "De",
            toLabel: "Até",
            customRangeLabel: "Personalizar",
            weekLabel: "S",
            daysOfWeek: ["D", "S", "T", "Q", "Q", "S", "S"],
            monthNames: [
                "Janeiro",
                "Fevereiro",
                "Março",
                "Abril",
                "Maio",
                "Junho",
                "Julho",
                "Agosto",
                "Setembro",
                "Outubro",
                "Novembro",
                "Dezembro"
            ],
            firstDay: 1
        },
        opens: 'left'
    }, function (start, end, label) {
        $('#txtTaskInicio').val(start.format('YYYY-MM-DD HH:mm'));
        $('#txtTaskFim').val(end.format('YYYY-MM-DD HH:mm'));
    });
}

export { renderTasks, showTab, hideTab, formatDate };
