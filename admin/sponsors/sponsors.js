const urlBase = "https://mtsiw.duckdns.org/pwa";
let isNew = true;

window.onload = () => {
    // References to HTML objects   
    const tblSponsors = document.getElementById("tblSponsors");
    const frmSponsor = document.getElementById("frmSponsor");

    frmSponsor.addEventListener("reset", (event) => {
        isNew = true;
    });

    frmSponsor.addEventListener("submit", async (event) => {
        event.preventDefault();
        const txtSponsorId = document.getElementById("txtSponsorId").value;
        const txtName = document.getElementById("txtName").value;
        const txtLogo = document.getElementById("txtLogo").value;
        const txtCategory = document.getElementById("txtCategory").value;
        const txtLink = document.getElementById("txtLink").value;

        try {
            // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados de um sponsor
            let response;
            let msgBody = `idSponsor=${txtSponsorId}&nome=${txtName}&logo=${txtLogo}&categoria=${txtCategory}&link=${txtLink}`;
            if (isNew) {
                // Adiciona Sponsor
                response = await fetch(`${urlBase}/sponsors`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    body: msgBody
                });
            } else {
                // Atualiza Sponsor
                response = await fetch(`${urlBase}/sponsors/${txtSponsorId}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "PUT",
                    body: msgBody
                });
            }

            let result = await response.json();

            if (result.success == true) {
                frmSponsor.reset();

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

        renderSponsors();
    });

    const renderSponsors = async () => {
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
        `;
        const response = await fetch(`${urlBase}/sponsors`);
        const sponsors = await response.json();
        let i = 1;
        for (const sponsor of sponsors) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${sponsor.nome}</td>
                    <td>${sponsor.categoria}</td>
                    <td class="text-right">
                        <i id='edit-${sponsor.idSponsor}' idsponsor='${sponsor.idSponsor}' class='fas fa-edit edit as-button'></i>
                        <i id='remove-${sponsor.idSponsor}' idsponsor='${sponsor.idSponsor}' class='fas fa-trash-alt remove as-button'></i>
                    </td>
                </tr>
            `;
            i++;
        }
        strHtml += "</tbody>";
        tblSponsors.innerHTML = strHtml;

        // Gerir o clique no ícone de Editar        
        const btnEdit = document.getElementsByClassName("edit");
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", function () {
                let idSponsor = this.getAttribute('idsponsor');
                isNew = false;
                for (const sponsor of sponsors) {
                    if (sponsor.idSponsor == idSponsor) {
                        document.getElementById("txtSponsorId").value = sponsor.idSponsor;
                        document.getElementById("txtName").value = validator.unescape(sponsor.nome);
                        document.getElementById("txtLogo").value = validator.unescape(sponsor.logo);
                        document.getElementById("txtCategory").value = validator.unescape(sponsor.categoria);
                        document.getElementById("txtLink").value = validator.unescape(sponsor.link);
                    }
                }
            });
        }

        // Gerir o clique no ícone de Remover        
        const btnDelete = document.getElementsByClassName("remove")
        for (let i = 0; i < btnDelete.length; i++) {
            btnDelete[i].addEventListener("click", function () {
                let idSponsor = this.getAttribute('idsponsor');
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
                            const response = await fetch(`${urlBase}/sponsors/${idSponsor}`, {
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
                        renderSponsors();
                    }
                })
            })
        }
    };

    renderSponsors();
};