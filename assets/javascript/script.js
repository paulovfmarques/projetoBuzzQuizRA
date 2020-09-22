let dados = {
    email : "",
    password : ""
}

var token;

function conferirCamposLogin(){

     dados.email = document.querySelector(".campoEmail").value;
     dados.password = document.querySelector(".campoSenha").value;

     let login = dados.email;
     let senha = dados.password;

    if(login === "" || senha === ""){

        alert("Preencha todos os campos!")

        return;
    }    

    cadastro();    
}

function cadastro(){

    var btnEntrar = document.querySelector(".entrar");
    btnEntrar.disabled = true;

    var requisição = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/users", dados)
    
    requisição.then(processaCadastro).catch(trataErro)
}

function processaCadastro(data){

    var btnEntrar = document.querySelector(".entrar");
    btnEntrar.disabled = false;

    token = data.token;

    mudandoParaQuizzes();

}

function trataErro(){
    alert("Usuário/Senha Incorretos!");
    window.location.reload()
}

function mudandoParaQuizzes(){
    
    var telaInicial = document.querySelector("body > header");
    telaInicial.style.display = "none";
}