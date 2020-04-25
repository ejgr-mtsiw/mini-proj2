const urlBase = "https://fcawebbook.herokuapp.com"
let isNew = true

window.onload = () => {
    // References to HTML objects   
    const tblSponsors = document.getElementById("tblSponsors")
    const frmSponsor = document.getElementById("frmSponsor")

    frmSponsor.addEventListener("submit", async (event) => {
        event.preventDefault()
        const txtSponsorId = document.getElementById("txtSponsorId").value
        const txtName = document.getElementById("txtName").value
        const txtLogo = document.getElementById("txtLogo").value
        const txtCategory = document.getElementById("txtCategory").value
        const txtLink = document.getElementById("txtLink").value
        

        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados de um sponsor
        let response
        if (isNew) {
            // Adiciona Sponsor
            response = await fetch(`${urlBase}/sponsors`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: `nome=${txtName}&logo=${txtLogo}&categoria=${txtCategory}&link=${txtLink}&active=1`
            })
            const newSponsorId = response.headers.get("Location")
            const newSponsor = await response.json()
            // Associa sponsor à conferência WebConfernce
            const newUrl = `${urlBase}/conferences/1/sponsors/${newSponsorId}`
            const response2 = await fetch(newUrl, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            })
            const newSponsor2 = await response2.json()
        } else {
            // Atualiza Sponsor
            response = await fetch(`${urlBase}/sponsors/${txtSponsorId}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `nome=${txtName}&logo=${txtLogo}&categoria=${txtCategory}&link=${txtLink}&active=1`
            })

            const newSponsor = await response.json()
        }
        isNew = true
        renderSponsors()
    })

    const renderSponsors = async () => {
        frmSponsor.reset()
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='4'>Lista de Sponsors</th></tr>
                <tr class='bg-info'>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Categoria</th>              
                    <th class="text-right">Ações</th>              
                </tr> 
            </thead><tbody>
        `
        const response = await fetch(`${urlBase}/conferences/1/sponsors`)
        const sponsors = await response.json()
        let i = 1
        for (const sponsor of sponsors) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${sponsor.nome}</td>
                    <td>${sponsor.categoria}</td>
                    <td class="text-right">
                        <i id='${sponsor.idSponsor}' class='fas fa-edit edit'></i>
                        <i id='${sponsor.idSponsor}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblSponsors.innerHTML = strHtml

        // Gerir o clique no ícone de Editar        
        const btnEdit = document.getElementsByClassName("edit")
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", () => {
                isNew = false
                for (const sponsor of sponsors) {
                    if (sponsor.idSponsor == btnEdit[i].getAttribute("id")) {
                        document.getElementById("txtSponsorId").value = sponsor.idSponsor
                        document.getElementById("txtName").value = sponsor.nome
                        document.getElementById("txtLogo").value = sponsor.logo
                        document.getElementById("txtCategory").value = sponsor.categoria
                        document.getElementById("txtLink").value = sponsor.link
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
                        let sponsorId = btnDelete[i].getAttribute("id")
                        try {
                            const response = await fetch(`${urlBase}/conferences/1/sponsors/${sponsorId}`, {
                                method: "DELETE"
                            })
                            if (response.status == 204) {
                                swal('Removido!', 'O sponsor foi removido da Conferência.', 'success')
                            }
                        } catch (err) {
                            swal({
                                type: 'error',
                                title: 'Erro',
                                text: err
                            })
                        }
                        renderSponsors()
                    }
                })
            })
        }
    }
    renderSponsors()
}