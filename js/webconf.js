window.onload = function () {
    const urlBase = "https://mtsiw.duckdns.org/pwa";
    var idConference = 1;

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('signout')) {
        sessionStorage.removeItem("token");
    }

    if (urlParams.get('idConference')) {
        idConference = Number(urlParams.get('idConference'));
    }

    const btnLogin = document.getElementById("btnLogin");
    const btnRegister = document.getElementById("btnRegister");
    const aSponsors = document.getElementById("aSponsors");
    const aSpeakers = document.getElementById("aSpeakers");
    const aAbout = document.getElementById("aAbout");
    const aContacts = document.getElementById("aContacts");

    aSponsors.addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById("sponsors").scrollIntoView({ behavior: 'smooth' });
    });

    aSpeakers.addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById("speakers").scrollIntoView({ behavior: 'smooth' });
    });

    aAbout.addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById("sobre").scrollIntoView({ behavior: 'smooth' });
    });

    aContacts.addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById("contacts").scrollIntoView({ behavior: 'smooth' });
    });

    // Autenticar administrador na área privada
    btnLogin.addEventListener("click", () => {

        Swal.fire({
            title: "Acesso à área de gestão da WebConference",
            html: `
                    <input type="email" id="txtEmail" class="swal2-input" placeholder="e-mail" required>
                    <input type="password" id="txtPass" class="swal2-input" required>
                `,
            showCancelButton: true,
            confirmButtonText: "Entrar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const email = document.getElementById('txtEmail').value;
                const pass = document.getElementById('txtPass').value;

                // very basic validation
                if (email.length == 0 || pass.length == 0) {
                    Swal.showValidationMessage('Dados inválidos!');
                    return
                } else {
                    return fetch(`${urlBase}/signin`, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: "POST",
                        body: `email=${email}&password=${pass}`
                    }).then((response) => {

                        if (!response.ok) {
                            throw new Error(response.statusText)
                        }
                        return response.json();
                    }).catch((err) => {
                        Swal.showValidationMessage('Dados inválidos.');
                    });
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value.success == true) {
                    // Guardar token
                    sessionStorage.token = email;
                    window.location.replace("admin/conferences/conferences.html");
                } else {
                    Swal.showValidationMessage(result.value.message.pt);
                }
            }
        }).catch((err) => {
            Swal.showValidationMessage(err);
        });
    });

    // Registar participante
    btnRegister.addEventListener("click", function () {
        Swal.fire({
            title: "Inscrição na WebConference",
            html:
                '<input type="text" id="participant_nome" class="swal2-input" required placeholder="Nome">' +
                '<input type="email" id="participant_email" class="swal2-input" required placeholder="E-mail">',
            showCancelButton: true,
            confirmButtonText: "Inscrever",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                const nome = document.getElementById('participant_nome').value;
                const email = document.getElementById('participant_email').value;

                // very basic validation
                if (nome.length == 0) {
                    Swal.showValidationMessage('O nome é de preenchimento obrigatório!');
                    return;
                }

                if (email.length == 0) {
                    Swal.showValidationMessage('O email é de preenchimento obrigatório!');
                    return;
                }

                let msgBody = `idConference=${idConference}&email=${email}&nome=${nome}`;
                let response = await fetch(`${urlBase}/conferences/${idConference}/participants/`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    body: msgBody
                });

                let result = await response.json();

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
                        title: 'Erro!',
                        text: result.message.pt,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Fechar'
                    });
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        });
    });


    /* 
      Get speakers from server
    */
    (async () => {
        const renderSpeakers = document.getElementById("renderSpeakers");
        let txtSpeakers = "";
        const response = await fetch(`${urlBase}/conferences/${idConference}/speakers`);
        const speakers = await response.json();

        for (const speaker of speakers) {
            txtSpeakers += `
    <div class="col-sm-4">
      <div class="team-member">      
        <img id="${speaker.idSpeaker}" class="mx-auto rounded-circle viewSpeaker" src="${speaker.foto}" alt="">
        <h4>${speaker.nome}</h4>
        <p class="text-muted">${speaker.cargo}</p>
        <ul class="list-inline social-buttons">`
            if (speaker.twitter) {
                txtSpeakers += `
        <li class="list-inline-item">
          <a href="${speaker.twitter}" target="_blank">
            <i class="fab fa-twitter"></i>
          </a>
        </li>`
            }
            if (speaker.facebook) {
                txtSpeakers += `
        <li class="list-inline-item">
          <a href="${speaker.facebook}" target="_blank">
            <i class="fab fa-facebook-f"></i>
          </a>
        </li>`
            }
            if (speaker.linkedin) {
                txtSpeakers += `
        <li class="list-inline-item">
          <a href="${speaker.linkedin}" target="_blank">
            <i class="fab fa-linkedin-in"></i>
          </a>
        </li>`
            }
            txtSpeakers += `                
        </ul>
      </div>
    </div>
    `;
        }
        renderSpeakers.innerHTML = txtSpeakers;

        // Gerir clique na imagem para exibição da modal    
        const btnView = document.getElementsByClassName("viewSpeaker")
        for (let i = 0; i < btnView.length; i++) {
            btnView[i].addEventListener("click", () => {
                for (const speaker of speakers) {
                    if (speaker.idSpeaker == btnView[i].getAttribute("id")) {
                        Swal.fire({
                            title: speaker.nome,
                            text: speaker.bio,
                            imageUrl: validator.unescape(speaker.foto),
                            imageWidth: 400,
                            imageHeight: 400,
                            imageAlt: 'Foto do orador'
                        });
                    }
                }
            })
        }

    })();


    /*
      Get sponsors from server
    */

    (async () => {
        const renderSponsors = document.getElementById("renderSponsors");
        let txtSponsors = "";
        const response = await fetch(`${urlBase}/conferences/${idConference}/sponsors`);
        const sponsors = await response.json();

        for (const sponsor of sponsors) {
            txtSponsors += `
    <div class="col-md-3 col-sm-6">
      <a href="${sponsor.link}" target="_blank">
        <img class="img-fluid d-block mx-auto" src="${sponsor.logo}" alt="${sponsor.nome}">
      </a>
    </div>`
        }
        renderSponsors.innerHTML = txtSponsors
    })();

    /*
      Post user messages to the server
    */

    const contactForm = document.getElementById("contactForm")
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        //const phone = document.getElementById("phone").value
        const subject = document.getElementById("message").value
        const response = await fetch(`${urlBase}/contacts/emails`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            body: `email=${email}&name=${name}&subject=${subject}`
        })
        const result = await response.json()

        if (typeof result.success != "undefined") {
            Swal.fire({
                title: 'Envio de mensagem',
                text: result.message.pt,
                icon: 'success'
            });
        } else {
            for (error in result) {
                document.getElementById("#" + error.param)
            }
            //Swal.fire('Envio de mensagem', result.message.pt, 'error')
        }
    });
};

function myMap() {

    // Ponto no mapa a localizar (cidade do Porto)
    const porto = new google.maps.LatLng(41.14961, -8.61099)

    // Propriedades do mapa
    const mapProp = {
        center: porto,
        zoom: 12,
        scrollwheel: false,
        draggable: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    // Mapa
    const map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    // Janela de informação (info window)
    const infowindow = new google.maps.InfoWindow({
        content: "É aqui a WebConference!"
    })

    // Marcador
    const marker = new google.maps.Marker({
        position: porto,
        map: map,
        title: "WebConference"
    })

    // Listener
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    })

}
