const urlBase = "https://fcawebbook.herokuapp.com"
let isNew = true

window.onload = () => {
    // References to HTML objects   
    const tblVolunteers = document.getElementById("tblVolunteers")
    const frmVolunteer = document.getElementById("frmVolunteer")


    frmVolunteer.addEventListener("submit", async (event) => {
        event.preventDefault()
        const txtName = document.getElementById("txtName").value
        const txtEmail = document.getElementById("txtEmail").value
        const txtPhone = document.getElementById("txtPhone").value
        const txtVolunteerId = document.getElementById("txtVolunteerId").value

        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados de um orador
        let response
        if (isNew) {
            // Adiciona Voluntário
            response = await fetch(`${urlBase}/volunteers`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: `name=${txtName}&email=${txtEmail}&phone=${txtPhone}&active=1`
            })
            const newVolunteerId = response.headers.get("Location")
            const newVolunteer = await response.json()

            // Associa voluntário à conferência WebConfernce
            const newUrl = `${urlBase}/conferences/1/volunteers/${newVolunteerId}`
            const response2 = await fetch(newUrl, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            })
            const newVolunteer2 = await response2.json()
        } else {
            // Atualiza Voluntário
            response = await fetch(`${urlBase}/volunteers/${txtVolunteerId}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `name=${txtName}&email=${txtEmail}&phone=${txtPhone}&active=1`
            })

            const newVolunteer = await response.json()
        }
        isNew = true
        renderVolunteers()
    })


    const renderVolunteers = async () => {
        frmVolunteer.reset()
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
        `
        //const response = await fetch(`${urlBase}/conferences/1/volunteers`)
        //const volunteers = await response.json()
        const volunteers = [
            {
                'id': 1,
                'name': 'Um Voluntário',
                'email': 'teste@teste.com',
                'phone': '123 123 123'
            },
            {
                'id': 2,
                'name': 'Outro Voluntário',
                'email': 'teste2@teste.com',
                'phone': '321 312 312'
            },
        ]
        let i = 1
        for (const volunteer of volunteers) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${volunteer.name}</td>
                    <td>${volunteer.email}</td>
                    <td>${volunteer.phone}</td>
                    <td class="text-right">
                        <i id='${volunteer.id}' class='fas fa-edit edit'></i>
                        <i id='${volunteer.id}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblVolunteers.innerHTML = strHtml

        // Gerir o clique no ícone de Editar        
        const btnEdit = document.getElementsByClassName("edit")
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", () => {
                isNew = false
                for (const volunteer of volunteers) {
                    if (volunteer.id == btnEdit[i].getAttribute("id")) {
                        document.getElementById("txtVolunteerId").value = volunteer.id
                        document.getElementById("txtName").value = volunteer.name
                        document.getElementById("txtEmail").value = volunteer.email
                        document.getElementById("txtPhone").value = volunteer.phone
                    }
                }
            })
        }

        // Gerir o clique no ícone de Remover        
        const btnDelete = document.getElementsByClassName("remove")
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
                        let volunteerId = btnDelete[i].getAttribute("id")
                        try {
                            const response = await fetch(`${urlBase}/conferences/1/volunteers/${volunteerId}`, {
                                method: "DELETE"
                            })
                            if (response.status == 204) {
                                swal('Removido!', 'O voluntário foi removido da Conferência.', 'success')
                            }
                        } catch (err) {
                            swal({
                                type: 'error',
                                title: 'Erro',
                                text: err
                            })
                        }
                        renderVolunteers()
                    }
                })
            })
        }
    }
    renderVolunteers()
}