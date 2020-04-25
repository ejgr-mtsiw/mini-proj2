window.onload = function () {
  const urlBase = "https://fcawebbook.herokuapp.com"

  const btnLogin = document.getElementById("btnLogin")
  const btnRegister = document.getElementById("btnRegister")
  const aSponsors = document.getElementById("aSponsors")

  aSponsors.addEventListener("click", function () {
    document.getElementById("sponsors").scrollIntoView({ behavior: 'smooth' })
  })

  aSponsors.addEventListener("mouseover", function () {
    document.getElementById("aSponsors").style.cursor = "pointer";
  })

  // Autenticar administrador na área privada
  btnLogin.addEventListener("click", function () {
    Swal.fire({
      title: "Acesso à área de gestão da WebConference",
      html:
        '<input id="txtEmail" class="swal2-input" placeholder="e-mail">' +
        '<input id="txtPass" class="swal2-input" placeholder="password">',
      showCancelButton: true,
      confirmButtonText: "Entrar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const email = document.getElementById('txtEmail').value
        const pass = document.getElementById('txtPass').value

        // very basic validation
        if (email.length == 0 || pass.length == 0) {
          Swal.showValidationMessage('Dados inválidos!')
          return
        } else {
          //! TODO: FIX THIS!
          //! Signin is not working, so as long as we write something we login
          //Swal.fire({ title: "Autenticação feita com sucesso!" })
          // Guardar token
          sessionStorage.token = email;
          window.location.replace("admin/participants.html")
          return
        }

        return fetch(`${urlBase}/signin`, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          body: `email=${email}&password=${pass}`
        })
          .then((response) => {
            if (!response.hasOwnProperty("success")) {
              throw new Error(response.statusText);
            }

            if (response.success == 'false') {
              Swal.showValidationMessage(`Pedido falhado: ${response.message.pt}`);
            }

            return response.json();
          })
          .catch(error => {
            Swal.showValidationMessage(`Pedido falhado: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (!result.dismiss) {
        if (result.value.sucesss) {
          Swal.fire({ title: "Autenticação feita com sucesso!" })
          // Guardar token
          sessionStorage.token = email;
          window.location.replace("admin/participants.html")
        } else {
          Swal.fire({ title: `${result.value.message.pt}` })
        }
      }
    });
  });

  // Registar participante
  btnRegister.addEventListener("click", function () {
    Swal.fire({
      title: "Inscrição na WebConference",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="nome">' +
        '<input id="swal-input2" class="swal2-input" placeholder="e-mail">',
      showCancelButton: true,
      confirmButtonText: "Inscrever",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value
        const email = document.getElementById('swal-input2').value

        // very basic validation
        if (name.length == 0) {
          Swal.showValidationMessage('O nome é de preenchimento obrigatório!')
          return
        }

        if (email.length == 0) {
          Swal.showValidationMessage('O email é de preenchimento obrigatório!')
          return
        }

        return fetch(`${urlBase}/conferences/1/participants/${email}`, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          body: `nomeparticipant=${name}`
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .catch(error => {
            Swal.showValidationError(`Request failed: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.value) {
        if (!result.value.err_code) {
          Swal.fire({ title: "Inscrição feita com sucesso!" })
        } else {
          Swal.fire({ title: `${result.value.err_message}` })
        }
      }
    });
  });


  /* 
    Get speakers from server
  */
  (async () => {
    const renderSpeakers = document.getElementById("renderSpeakers")
    let txtSpeakers = ""
    const response = await fetch(`${urlBase}/conferences/1/speakers`)
    const speakers = await response.json()

    for (const speaker of speakers) {
      txtSpeakers += `
    <div class="col-sm-4">
      <div class="team-member">      
        <img id="${speaker.idSpeaker}" class="mx-auto rounded-circle viewSpeaker" src="${speaker.foto}" alt="">
        <h4>${speaker.nome}</h4>
        <p class="text-muted">${speaker.cargo}</p>
        <ul class="list-inline social-buttons">`
      if (speaker.twitter !== null) {
        txtSpeakers += `
        <li class="list-inline-item">
          <a href="${speaker.twitter}" target="_blank">
            <i class="fab fa-twitter"></i>
          </a>
        </li>`
      }
      if (speaker.facebook !== null) {
        txtSpeakers += `
        <li class="list-inline-item">
          <a href="${speaker.facebook}" target="_blank">
            <i class="fab fa-facebook-f"></i>
          </a>
        </li>`
      }
      if (speaker.linkedin !== null) {
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
    `
    }
    renderSpeakers.innerHTML = txtSpeakers


    // Gerir clique na imagem para exibição da modal    
    const btnView = document.getElementsByClassName("viewSpeaker")
    for (let i = 0; i < btnView.length; i++) {
      btnView[i].addEventListener("click", () => {
        for (const speaker of speakers) {
          if (speaker.idSpeaker == btnView[i].getAttribute("id")) {
            Swal.fire({
              title: speaker.nome,
              text: speaker.bio,
              imageUrl: speaker.foto,
              imageWidth: 400,
              imageHeight: 400,
              imageAlt: 'Foto do orador',
              animation: false
            })
          }
        }
      })
    }

  })();


  /*
    Get sponsors from server
  */

  (async () => {
    const renderSponsors = document.getElementById("renderSponsors")
    let txtSponsors = ""
    const response = await fetch(`${urlBase}/conferences/1/sponsors`)
    const sponsors = await response.json()

    for (const sponsor of sponsors) {
      txtSponsors += `
    <div class="col-md-3 col-sm-6">
      <a href="#" target="_blank">
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
  contactForm.addEventListener("submit", async function () {
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
      Swal.fire('Envio de mensagem', result.message.pt, 'success')
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
