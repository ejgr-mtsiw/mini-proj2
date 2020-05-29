const urlBase = "https://mtsiw.duckdns.org/pwa";
let isNew = true;

window.onload = () => {
    // References to HTML objects   
    const tblCommittee = document.getElementById("tblCommittee");
    const frmCommittee = document.getElementById("frmCommittee");

    frmCommittee.addEventListener("reset", (event) => {
        isNew = true;
    });

    frmCommittee.addEventListener("submit", async (event) => {
        event.preventDefault();
        const txtCommitteeMemberId = document.getElementById("txtCommitteeMemberId").value;
        const txtNome = document.getElementById("txtNome").value;
        const txtEmail = document.getElementById("txtEmail").value;
        const txtInstituicao = document.getElementById("txtInstituicao").value;
        const txtCargo = document.getElementById("txtCargo").value;
        const txtFoto = document.getElementById("txtFoto").value;
        const txtFacebook = document.getElementById("txtFacebook").value;
        const txtTwitter = document.getElementById("txtTwitter").value;
        const txtLinkedin = document.getElementById("txtLinkedin").value;
        const txtBio = document.getElementById("txtBio").value;

        // Verifica flag isNew para saber se se trata de uma adição ou de
        // uma atualização dos dados de um membro do comité
        try {
            let response;
            let msgBody = `idCommitteeMember=${txtCommitteeMemberId}` +
                `&nome=${txtNome}` +
                `&email=${txtEmail}` +
                `&instituicao=${txtInstituicao}` +
                `&cargo=${txtCargo}` +
                `&foto=${txtFoto}` +
                `&facebook=${txtFacebook}` +
                `&twitter=${txtTwitter}` +
                `&linkedin=${txtLinkedin}` +
                `&bio=${txtBio}`;

            if (isNew) {
                // Adiciona Membro do comité
                response = await fetch(`${urlBase}/committee`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    body: msgBody
                });
            } else {
                // Atualiza Membro do comité
                response = await fetch(`${urlBase}/committee/${txtCommitteeMemberId}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "PUT",
                    body: msgBody
                })
            }

            let result = await response.json();

            if (result.success == true) {
                frmCommittee.reset();

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
        renderCommittee();
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
        const response = await fetch(`${urlBase}/committee`);
        const members = await response.json();

        let i = 1;
        for (const member of members) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${member.nome}</td>
                    <td>${member.email}</td>
                    <td>${member.instituicao}</td>
                    <td>${member.cargo}</td>
                    <td class="text-right">
                        <i id='edit-${member.idCommitteeMember}' idcommittemember='${member.idCommitteeMember}' class='fas fa-edit edit as-button'></i>
                        <i id='remove-${member.idCommitteeMember}' idcommittemember='${member.idCommitteeMember}' class='fas fa-trash-alt remove as-button'></i>
                    </td>
                </tr>
            `;
            i++;
        }
        strHtml += "</tbody>";
        tblCommittee.innerHTML = strHtml;

        // Gerir o clique no ícone de Editar        
        const btnEdit = document.getElementsByClassName("edit");
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", function () {
                let idCommitteeMember = this.getAttribute('idcommittemember');
                isNew = false;
                for (const member of members) {
                    if (member.idCommitteeMember == idCommitteeMember) {
                        document.getElementById("txtCommitteeMemberId").value = member.idCommitteeMember;
                        document.getElementById("txtNome").value = member.nome;
                        document.getElementById("txtEmail").value = member.email;
                        document.getElementById("txtInstituicao").value = member.instituicao;
                        document.getElementById("txtCargo").value = member.cargo;
                        document.getElementById("txtFoto").value = member.foto;
                        document.getElementById("txtFacebook").value = member.facebook;
                        document.getElementById("txtTwitter").value = member.twitter;
                        document.getElementById("txtLinkedin").value = member.linkedin;
                        document.getElementById("txtBio").value = member.bio;
                    }
                }
            })
        }

        // Gerir o clique no ícone de Remover        
        const btnDelete = document.getElementsByClassName("remove")
        for (let i = 0; i < btnDelete.length; i++) {
            btnDelete[i].addEventListener("click", function () {
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
                        let idCommitteeMember = this.getAttribute('idcommittemember');
                        try {
                            const response = await fetch(`${urlBase}/committee/${idCommitteeMember}`, {
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
                        renderCommittee();
                    }
                })
            })
        }
    }
    renderCommittee();
}