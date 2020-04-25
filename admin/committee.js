const urlBase = "https://fcawebbook.herokuapp.com"
let isNew = true

window.onload = () => {
    // References to HTML objects   
    const tblCommittee = document.getElementById("tblCommittee")
    const frmCommittee = document.getElementById("frmCommittee")


    frmCommittee.addEventListener("submit", async (event) => {
        event.preventDefault()
        const txtCommitteeMemberId = document.getElementById("txtCommitteeMemberId").value
        const txtName = document.getElementById("txtName").value
        const txtEmail = document.getElementById("txtEmail").value
        const txtInstitution = document.getElementById("txtInstitution").value
        const txtOffice = document.getElementById("txtOffice").value
        const txtPhoto = document.getElementById("txtPhoto").value
        const txtFacebook = document.getElementById("txtFacebook").value
        const txtTwitter = document.getElementById("txtTwitter").value
        const txtLinkedin = document.getElementById("txtLinkedin").value
        const txtBio = document.getElementById("txtBio").value

        // Verifica flag isNew para saber se se trata de uma adição ou de
        // uma atualização dos dados de um membro do comité
        let response
        if (isNew) {
            // Adiciona Membro do comité
            response = await fetch(`${urlBase}/committee`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: `name=${txtName}` +
                    `&email=${txtEmail}` +
                    `&institution=${txtInstitution}` +
                    `&office=${txtOffice}` +
                    `&photo=${txtPhoto}` +
                    `&facebook=${txtFacebook}` +
                    `&twitter=${txtTwitter}` +
                    `&linkedin=${txtLinkedin}` +
                    `&bio=${txtBio}` +
                    `&active=1`
            })
            const newCommitteeMemberId = response.headers.get("Location")
            const newCommitteeMember = await response.json()

            // Associa Membro do comité à conferência WebConfernce
            const newUrl = `${urlBase}/conferences/1/committee/${newCommitteeMemberId}`
            const response2 = await fetch(newUrl, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            })
            const newVolunteer2 = await response2.json()
        } else {
            // Atualiza Membro do comité
            response = await fetch(`${urlBase}/committee/${txtCommitteeMemberId}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `name=${txtName}` +
                    `&email=${txtEmail}` +
                    `&institution=${txtInstitution}` +
                    `&office=${txtOffice}` +
                    `&photo=${txtPhoto}` +
                    `&facebook=${txtFacebook}` +
                    `&twitter=${txtTwitter}` +
                    `&linkedin=${txtLinkedin}` +
                    `&bio=${txtBio}` +
                    `&active=1`
            })

            const newCommitteeMember = await response.json()
        }
        isNew = true
        renderCommittee()
    })


    const renderCommittee = async () => {
        frmCommittee.reset()
        let strHtml = `
            <thead >
                <tr>
                    <th class='w-100 text-center bg-warning' colspan='6'>
                        Lista de Membros do Comité Científico
                    </th>
                </tr>
                <tr class='bg-info'>
                    <th>#</th>
                    <th>Nome</th>
                    <th>E-mail</th>              
                    <th>Instituição</th>
                    <th>Cargo</th>
                    <th class="text-right">Ações</th>              
                </tr> 
            </thead><tbody>
        `
        //const response = await fetch(`${urlBase}/conferences/1/volunteers`)
        //const volunteers = await response.json()

        body: `name=${txtName}` +
                    `&email=${txtEmail}` +
                    `&institution=${txtInstitution}` +
                    `&office=${txtOffice}` +
                    `&photo=${txtPhoto}` +
                    `&facebook=${txtFacebook}` +
                    `&twitter=${txtTwitter}` +
                    `&linkedin=${txtLinkedin}` +
                    `&bio=${txtBio}` +
                    `&active=1`


        const members = [
            {
                'id': 1,
                'name': 'Um Membro',
                'email': 'teste@teste.com',
                'institution': 'Uma Universidade',
                'office': 'Coordenador dos Cursos de Agricultura',
                'photo': 'https://url.da.foto.com',
                'facebook': 'https://pagina.do.facebook.com/1',
                'twitter': 'https://pagina.do.twitter.com/1',
                'linkedin': 'https://pagina.do.linkedin.com/1',
                'bio': 'A minha história',
            },
            {
                'id': 2,
                'name': 'Outro Membro',
                'email': 'teste@teste.com',
                'institution': 'Outra Universidade',
                'office': 'Coordenador dos Cursos de Física',
                'photo': 'https://url.da.foto.com/2',
                'facebook': 'https://pagina.do.facebook.com/2',
                'twitter': 'https://pagina.do.twitter.com/2',
                'linkedin': 'https://pagina.do.linkedin.com/2',
                'bio': 'A minha outra história',
            },
        ]
        let i = 1
        for (const member of members) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${member.name}</td>
                    <td>${member.email}</td>
                    <td>${member.institution}</td>
                    <td>${member.office}</td>
                    <td class="text-right">
                        <i id='${member.id}' class='fas fa-edit edit'></i>
                        <i id='${member.id}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblCommittee.innerHTML = strHtml

        // Gerir o clique no ícone de Editar        
        const btnEdit = document.getElementsByClassName("edit")
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", () => {
                isNew = false
                for (const member of members) {
                    if (member.id == btnEdit[i].getAttribute("id")) {
                        document.getElementById("txtCommitteeMemberId").value = member.id
                        document.getElementById("txtName").value = member.name
                        document.getElementById("txtEmail").value = member.email
                        document.getElementById("txtInstitution").value = member.institution
                        document.getElementById("txtOffice").value = member.office
                        document.getElementById("txtPhoto").value = member.photo
                        document.getElementById("txtFacebook").value = member.facebook
                        document.getElementById("txtTwitter").value = member.twitter
                        document.getElementById("txtLinkedin").value = member.linkedin
                        document.getElementById("txtBio").value = member.bio
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
                        let committeeMemberId = btnDelete[i].getAttribute("id")
                        try {
                            const response = await fetch(`${urlBase}/conferences/1/committee/${committeeMemberId}`, {
                                method: "DELETE"
                            })
                            if (response.status == 204) {
                                swal('Removido!', 'O membro do comité científico foi removido da Conferência.', 'success')
                            }
                        } catch (err) {
                            swal({
                                type: 'error',
                                title: 'Erro',
                                text: err
                            })
                        }
                        renderCommittee()
                    }
                })
            })
        }
    }
    renderCommittee()
}