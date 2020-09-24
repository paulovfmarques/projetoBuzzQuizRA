let dados = {email : "", password : ""}
let token = "";
var countP = 0;
var countN = 0;
let pergunta = [];
let nivel = [];
let quiz = {};
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
    carregandoQuizzes();
   // setTimeout(carregandoQuizzes, 250);
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

    var dados = info.data;
    var quizNode = document.querySelector(".container-quizzes");
    
    quizNode.innerHTML = "";

    let liNovo = document.createElement("li");
    liNovo.classList.add("novo-quizz");
    liNovo.innerHTML = "<strong>Novo<br>Quizz</strong>";
    liNovo.innerHTML += "<button><ion-icon class='add-icon' onclick='mudandoParaCriacao()' name='add-circle'></ion-icon></button>";
    quizNode.appendChild(liNovo);

    for(var i = 0; i < dados.length; i++){

        let li = document.createElement("li");
        li.classList.add("quizz-adicionado");
        li.setAttribute("onclick", "abreQuiz(this)");
        li.setAttribute("id", dados[i].id);
        li.innerHTML = `<p>${dados[i].title}</p>`;

        quizNode.appendChild(li);
    }
   
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

function renderizaPerguntas(){

    countP++; 

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

function voltandoMenu(info){      

    console.log(info.data)

    var menuQuizzes = document.querySelector(".menu-quizzes");
    var criarQuiz = document.querySelector(".criar-quiz");

    //deve ser executado depois 
    //de receber OK do server no envio do Quiz
    let perguntaNode = document.querySelector(".container-pergunta");
    let nivelNode = document.querySelector(".container-nivel");    
    perguntaNode.innerHTML = "";
    nivelNode.innerHTML = "";
    countN = 0;
    countP = 0;
    pergunta = [];
    nivel = [];
    quiz = {};
    //------------------------------------------

    menuQuizzes.classList.remove("fade-out");
    menuQuizzes.classList.add("fade-in");
    
    criarQuiz.classList.remove("fade-in");
    criarQuiz.classList.add("fade-out");
    criarQuiz.style.display = "none";
    
    carregandoQuizzes();
}

function salvaPerguntaQuiz(){
    
    for(var i = 1; i <= countP; i++){

        let resp = { 
            "resposta" : "",
            "linkResposta" : "",
            "flag" : false };
        
        let Resposta = [];

        let perg = {
            "tituloPergunta" : "",
            "Respostas" : Resposta};    

        var ID = `#p${i}`;
        var elemento = document.querySelector(ID);
        //Pega todos os inputs de cada bloco de pergunta
        var inputs = elemento.querySelectorAll(".certo-errado input");
        var inputPergunta = elemento.querySelector(".inputPergunta").value;

        for( var j = 0; j < 4; j++){

            let resp = { 
                "resposta" : "",
                "linkResposta" : "",
                "flag" : false };

            if(j == 0){
                resp.flag = true;
            }

            resp.resposta = inputs[(2 * j)].value;
            resp.linkResposta = inputs[((2 * j) + 1)].value            

            Resposta.push(resp);

        }

        perg.tituloPergunta = inputPergunta;

        pergunta.push(perg);
    }
}

function salvaNivelQuiz(){

    for(var i = 1; i <= countN; i++){

        let niv = {
            "rangeMin" : "",
            "rangeMax" : "",
            "tituloNivel" : "",
            "linkNivel" : "",
            "desc" : ""
        };

        var ID = `#n${i}`;
        var elemento = document.querySelector(ID);
        var inputs = elemento.querySelectorAll("input");        

        niv.rangeMax = inputs[0].value;
        niv.rangeMax = inputs[1].value;
        niv.tituloNivel = inputs[2].value;
        niv.linkNivel = inputs[3].value;
        niv.desc = inputs[4].value;

        nivel.push(niv)
        
    }
}

function montaQuiz(){

    var inputTitulo = document.querySelector(".inputTitulo").value;

    quiz = {
        "title" : inputTitulo,
        "data" : {pergunta, nivel}
    }

    inputTitulo = "";

}

function enviaQuizzServidor(){

    salvaPerguntaQuiz();
    salvaNivelQuiz();  
    montaQuiz();

    var enviandoQuiz = axios.post(urlPostQuiz, quiz, {headers : {"User-token" : token}});
    enviandoQuiz.then(voltandoMenu).catch(trataErroEnvio);

}

function trataErroEnvio(err){
    alert("Preencha corretamente os dados");
}

var idAberto = "";

function abreQuiz(elem){

    idAberto = elem.getAttribute("id")    

    var abreQuiz = axios.get(urlGetQuiz, {headers : {"User-token" : token}});
    abreQuiz.then(renderQuizSelecionado).catch(trataErroMenu);
}

function renderQuizSelecionado(info){

    var dados = info.data;
    
    for(var i = 0; i < dados.length; i++){

        if(dados[i].id == idAberto){

            //renderizar o quiz selecionado

        }
    }

}