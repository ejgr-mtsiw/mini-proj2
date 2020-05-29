const urlBase = "https://mtsiw.duckdns.org/pwa";
let isNew = true;

window.onload = () => {
    // References to HTML objects   
    const tblVolunteers = document.getElementById("tblVolunteers");
    const frmVolunteer = document.getElementById("frmVolunteer");

    frmVolunteer.addEventListener("reset", (event) => {
        isNew = true;
    });

    frmVolunteer.addEventListener("submit", async (event) => {
        event.preventDefault();
        const txtName = document.getElementById("txtName").value;
        const txtEmail = document.getElementById("txtEmail").value;
        const txtTelefone = document.getElementById("txtTelefone").value;
        const txtVolunteerId = document.getElementById("txtVolunteerId").value;

        // Verifica flag isNew para saber se se trata de uma adição ou
        // de atualização dos dados de um voluntário
        let response;
        try {
            let msgBody = `idVolunteer=${txtVolunteerId}&nome=${txtName}&email=${txtEmail}&telefone=${txtTelefone}`;
            if (isNew) {
                // Adiciona Voluntário
                response = await fetch(`${urlBase}/volunteers`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    body: msgBody
                });
            } else {
                // Atualiza Voluntário
                response = await fetch(`${urlBase}/volunteers/${txtVolunteerId}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "PUT",
                    body: msgBody
                });
            }
            let result = await response.json();

            if (result.success == true) {
                frmVolunteer.reset();

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
                    title: 'Erro!',
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

        renderVolunteers();
    })

    const renderVolunteers = async () => {
        frmVolunteer.reset();
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='5'>Lista de Voluntários</th></tr>
                <tr class='bg-info'>
                    <th>#</th>
                    <th>Nome</th>
                    <th>E-mail</th>              
                    <th>Telemóvel</th>
                    <th class="text-right">Ações</th>              
                </tr> 
            </thead><tbody>
        `;
        const response = await fetch(`${urlBase}/volunteers`);
        const volunteers = await response.json();
        let i = 1;
        for (const volunteer of volunteers) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${volunteer.nome}</td>
                    <td>${volunteer.email}</td>
                    <td>${volunteer.telefone}</td>
                    <td class="text-right">
                        <i id='edit-${volunteer.idVolunteer}' idvolunteer='${volunteer.idVolunteer}' class='fas fa-edit edit as-button'></i>
                        <i id='remove-${volunteer.idVolunteer}' idvolunteer='${volunteer.idVolunteer}' class='fas fa-trash-alt remove as-button'></i>
                    </td>
                </tr>
            `;
            i++;
        }
        strHtml += "</tbody>";
        tblVolunteers.innerHTML = strHtml;

        // Gerir o clique no ícone de Editar        
        const btnEdit = document.getElementsByClassName("edit");
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", function () {
                let idVolunteer = this.getAttribute('idvolunteer');
                isNew = false;
                for (const volunteer of volunteers) {
                    if (volunteer.idVolunteer == idVolunteer) {
                        document.getElementById("txtVolunteerId").value = volunteer.idVolunteer;
                        document.getElementById("txtName").value = volunteer.nome;
                        document.getElementById("txtEmail").value = volunteer.email;
                        document.getElementById("txtTelefone").value = volunteer.telefone;
                    }
                }
            })
        }

        // Gerir o clique no ícone de Remover        
        const btnDelete = document.getElementsByClassName("remove");
        for (let i = 0; i < btnDelete.length; i++) {
            btnDelete[i].addEventListener("click", () => {
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
                        let volunteerId = btnDelete[i].getAttribute("idvolunteer")
                        try {
                            const response = await fetch(`${urlBase}/volunteers/${volunteerId}`, {
                                method: "DELETE"
                            });

                            const result = await response.json();

                            if (result.success == true) {
                                Swal.fire({
                                    title: 'Removido!',
                                    text: result.message.pt,
                                    icon: 'success',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: 'Fechar'
                                });
                            } else {
                                Swal.fire({
                                    title: 'Erro!',
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
                        renderVolunteers();
                    }
                })
            })
        }
    }
    renderVolunteers();
}