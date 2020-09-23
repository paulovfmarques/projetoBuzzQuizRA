let dados = {email : "", password : ""}
let token = "";
let qtdPerguntas = 1;
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

    // fazer função que imprime na tela os quizzes já criados    
   
}

function mudandoParaCriacao(){
    var menuQuizzes = document.querySelector(".menu-quizzes");
    var criarQuiz = document.querySelector(".criar-quiz");
    
    menuQuizzes.classList.remove("fade-in");
    menuQuizzes.classList.add("fade-out");
    
    criarQuiz.classList.add("fade-in");
    criarQuiz.style.display = "block";

    renderizaPerguntas();
    renderizaNiveis();
    
    
}

var countP = 0;

function renderizaPerguntas(){

    countP++; 

    // while(qtdPerguntas > 0){}
    let div = document.createElement("div");
    let perguntaNode = document.querySelector(".container-pergunta");
    let ID = `p${countP}`;
       
    div.classList.add("pergunta");    
    div.setAttribute("id", ID);

    div.innerHTML = `<h1>Pergunta ${countP}</h1>`;
    div.innerHTML += `<input class="inputPergunta" type="text" placeholder="Digite a pergunta">`;
    div.innerHTML += `<div class="certo-errado">
    <input class="certo" type="text" placeholder="Resposta correta">
    <input class="certo" type="text" placeholder="Link correto"> 
    <input class="errado" type="text" placeholder="Errada 1">
    <input class="errado" type="text" placeholder="Link errado 1">
    <input class="errado" type="text" placeholder="Errada 2">
    <input class="errado" type="text" placeholder="Link errado 2">
    <input class="errado" type="text" placeholder="Errada 3">
    <input class="errado" type="text" placeholder="Link errado 3">
    </div>`

    perguntaNode.appendChild(div);
    
    //console.log(countP)
}

var countN = 0;

function renderizaNiveis(){

    countN++

    let div = document.createElement("div");
    let nivelNode = document.querySelector(".container-nivel");
    let ID = `n${countN}`;

    div.classList.add("nivel");
    div.setAttribute("id", ID);

    div.innerHTML = `<h1>Nivel ${countN}</h1>`;
    div.innerHTML += `<div class="faixaAcerto">
    <input type="text" placeholder="% mín. do nível">
    <input type="text" placeholder="% máx. do nível">
    </div>`;
    div.innerHTML += `<input type="text" placeholder="Título do nível">`;
    div.innerHTML += `<input type="text" placeholder="Link da imagem">`;
    div.innerHTML += `<input type="text" placeholder="Descrição do nível">`;

    nivelNode.appendChild(div);
    
}

function voltandoMenu(){

    salvaPerguntaQuiz();

    var menuQuizzes = document.querySelector(".menu-quizzes");
    var criarQuiz = document.querySelector(".criar-quiz");

    // esse bloco deve ser executado depois 
    //de receber OK do server no envio do Quiz
    let perguntaNode = document.querySelector(".container-pergunta");
    let nivelNode = document.querySelector(".container-nivel");    
    perguntaNode.innerHTML = "";
    nivelNode.innerHTML = "";
    countN = 0;
    countP = 0;
    //------------------------------------------

    menuQuizzes.classList.remove("fade-out");
    menuQuizzes.classList.add("fade-in");
    
    criarQuiz.classList.remove("fade-in");
    criarQuiz.classList.add("fade-out");
    criarQuiz.style.display = "none";
}

// let pergunta = {
//     tituloPergunta : "",
//     Respostas : Resposta[]
// }

let Resposta = {
    resposta : "",
    linkResposta : "",
    flag : ""
}

function salvaPerguntaQuiz(){
    
    for(var i = 1; i <= countP; i++){
        
        var ID = `#p${i}`;
        var elemento = document.querySelector(ID);
        var inputs = elemento.querySelectorAll(".certo-errado input");

       
    }
}