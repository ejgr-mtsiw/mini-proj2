// References to HTML objects
const tblCommittee = document.getElementById("tblCommittee");
const tabCommittee = document.getElementById("nav-committee-tab");

const renderCommittee = async (idConference, conferenceName, urlBase) => {

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
    enableTab();
}

function enableTab() {
    // Enables committee tab link
    tabCommittee.classList.remove('disabled');
}

function disableTab() {
    // Disables committee tab link
    tabCommittee.classList.add('disabled');
}

export { renderCommittee, enableTab, disableTab };
