let dados = {email : "", password : ""}
let token = "";
const urlPostUsuario = "https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/users";
const urlPostQuiz = "https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/quizzes";
const urlGetQuiz = "https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/quizzes";


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

function processarEnter(e){
    if (e.keyCode == 13) {
        conferirCamposLogin();
        return false;
    }
}

function cadastro(){

    var btnEntrar = document.querySelector(".entrar");
    btnEntrar.disabled = true;

    var requisição = axios.post(urlPostUsuario, dados)
    
    requisição.then(processaCadastro).catch(trataErroCadastro)
}

function processaCadastro(resposta){

    var btnEntrar = document.querySelector(".entrar");
    btnEntrar.disabled = false;

    token = resposta.data.token;
    console.log(token)

    mudandoParaQuizzes();
    setTimeout(carregandoQuizzes, 1000);
}

function trataErroCadastro(){
    alert("Usuário/Senha Incorretos!");
    window.location.reload()
}

function mudandoParaQuizzes(){
    
    var telaInicial = document.querySelector("body > header");
    var telaQuizzes = document.querySelector(".menu-quizzes");

    telaInicial.classList.add("fade-out");    

    telaQuizzes.classList.add("fade-in");
    telaQuizzes.style.display = "block";
}

function carregandoQuizzes(){    
    var quizzes = axios.get(urlGetQuiz, {headers : {"User-token" : token}});
    quizzes.then(processaQuizzes).catch(trataErroMenu)
}

function trataErroMenu(){
    alert("Fatal Error: Falha no carregamento dos quizzes!");
    window.location.reload()
}

function processaQuizzes(info){
    console.log(info)

    // fazer função que imprime na tela os quizzes já criados    
   
}

function mudandoParaCriacao(){
    var menuQuizzes = document.querySelector(".menu-quizzes");
    var criarQuiz = document.querySelector(".criar-quiz");
    
    menuQuizzes.classList.remove("fade-in");
    menuQuizzes.classList.add("fade-out");
    
    criarQuiz.classList.add("fade-in");
    criarQuiz.style.display = "block";

    //menuQuizzes.style.display = "none";
}

