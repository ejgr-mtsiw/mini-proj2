
const urlBase = "https://mtsiw.duckdns.org/pwa";

window.onload = () => {
    // References to HTML objects   
    const btnParticipant = document.getElementById("btnParticipant");
    const tblParticipants = document.getElementById("tblParticipants");

    const renderParticipants = async () => {
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='4'>Lista de Participantes</th></tr>
                <tr class='bg-info'>
                    <th>#</th>
                    <th>Nome</th>
                    <th>E-mail</th>              
                    <th class="text-right">Ações</th>              
                </tr> 
            </thead><tbody>
        `;
        const response = await fetch(`${urlBase}/conference/1/participants`);
        const participants = await response.json();
        let i = 1;
        for (const participant of participants) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${participant.nomeParticipante}</td>
                    <td>${participant.idParticipant}</td>
                    <td class="text-right">
                    <i id='remove-${participant.idParticipant}' idparticipant='${participant.idParticipant}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `;
            i++;
        }
        strHtml += "</tbody>";
        tblParticipants.innerHTML = strHtml;

        // Manage click delete        
        const btnDelete = document.getElementsByClassName("remove");
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
                            const response = await fetch(`${urlBase}/conference/1/participants/${participantId}`,
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
                        renderParticipants();
                    }
                });
            });
        }
    }
    renderParticipants();
}